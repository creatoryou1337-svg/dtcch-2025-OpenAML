# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
import os
from typing import Optional

app = FastAPI(
    title="OpenAML Demo API",
    description="Простой API для проверки адресов на AML-риски (демо DTCC 2025)",
    version="0.1.0"
)

# Разрешаем CORS — чтобы фронт мог обращаться
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # в продакшене укажи конкретный домен фронта
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Пути к моделям — подставь реальные из твоего репозитория
# Если модели в подпапке Model/MultiClass — укажи так
MODELS_DIR = "./Model/MultiClass"

CATBOOST_PATH = os.path.join(MODELS_DIR, "CatBoost.joblib")
XGBOOST_PATH  = os.path.join(MODELS_DIR, "XGBoost.joblib")
SCALER_PATH   = os.path.join(MODELS_DIR, "scaler.pkl")

# Загрузка моделей при старте сервера
catboost_model = None
xgboost_model  = None
scaler         = None

try:
    if os.path.exists(CATBOOST_PATH):
        catboost_model = pickle.load(open(CATBOOST_PATH, "rb"))
        print(f"CatBoost загружен: {CATBOOST_PATH}")
    else:
        print(f"CatBoost не найден: {CATBOOST_PATH}")

    if os.path.exists(XGBOOST_PATH):
        xgboost_model = pickle.load(open(XGBOOST_PATH, "rb"))
        print(f"XGBoost загружен: {XGBOOST_PATH}")
    else:
        print(f"XGBoost не найден: {XGBOOST_PATH}")

    if os.path.exists(SCALER_PATH):
        scaler = pickle.load(open(SCALER_PATH, "rb"))
        print(f"Scaler загружен: {SCALER_PATH}")
    else:
        print(f"Scaler не найден: {SCALER_PATH}")
except Exception as e:
    print(f"Ошибка загрузки моделей: {e}")

class AddressRequest(BaseModel):
    address: str
    chain: Optional[str] = "ETH"  # ETH, BTC, TRX и т.д.

@app.get("/")
def root():
    return {
        "message": "OpenAML Demo API работает",
        "status": "online",
        "models_loaded": {
            "catboost": bool(catboost_model),
            "xgboost": bool(xgboost_model),
            "scaler": bool(scaler)
        }
    }

@app.post("/check-address")
def check_address(req: AddressRequest):
    if not catboost_model and not xgboost_model:
        raise HTTPException(status_code=503, detail="Модели не загружены. Проверьте пути к .joblib файлам.")

    # Здесь должна быть реальная предобработка адреса → признаки
    # Пока используем заглушку с типичными признаками (замени на свой feature extraction)
    features_dict = {
        "address": req.address,
        "chain": req.chain,
        "tx_count_in": 120,
        "tx_count_out": 85,
        "total_volume_usd": 145000.75,
        "unique_counterparties": 38,
        "avg_tx_value_usd": 1208.33,
        "days_since_first_tx": 420,
        "max_single_tx_usd": 50000,
        "interactions_with_known_risky": 3,
        "mixer_usage_count": 0,
        "sanctioned_connections": 0,
        # ... добавь все признаки, которые ожидает твоя модель
    }

    # Преобразуем в DataFrame
    df = pd.DataFrame([features_dict])

    # Масштабируем, если есть scaler
    if scaler:
        try:
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            df[numeric_cols] = scaler.transform(df[numeric_cols])
        except Exception as e:
            print(f"Ошибка масштабирования: {e}")

    # Inference
    risk_scores = []

    if catboost_model:
        try:
            prob_cat = catboost_model.predict_proba(df)[:, 1]  # вероятность "рискового" класса
            risk_scores.append(prob_cat[0])
        except Exception as e:
            print(f"CatBoost inference error: {e}")

    if xgboost_model:
        try:
            prob_xgb = xgboost_model.predict_proba(df)[:, 1]
            risk_scores.append(prob_xgb[0])
        except Exception as e:
            print(f"XGBoost inference error: {e}")

    if not risk_scores:
        raise HTTPException(status_code=500, detail="Ни одна модель не смогла сделать предсказание")

    avg_risk = np.mean(risk_scores)
    category = (
        "High Risk (Sanctioned / Illicit)" if avg_risk > 0.7 else
        "Medium Risk (Suspicious)" if avg_risk > 0.3 else
        "Low Risk (Normal)"
    )

    return {
        "address": req.address,
        "chain": req.chain,
        "risk_score": round(float(avg_risk), 4),
        "category": category,
        "confidence": round(float(max(risk_scores)), 4) if risk_scores else None,
        "note": "Это демо. В реальном проекте добавьте полноценный feature extraction и обработку транзакций."
    }
