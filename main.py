from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import pandas as pd
from typing import Optional

app = FastAPI(title="OpenAML Demo API", description="Простой API для проверки адреса на AML-риски")

# Путь к твоим моделям (укажи реальный путь в репозитории)
MODEL_PATH_CATBOOST = "./Model/MultiClass/CatBoost.joblib"  # пример, подставь свой
MODEL_PATH_XGBOOST  = "./Model/MultiClass/XGBoost.joblib"

# Загрузка модели (лучше один раз при старте)
try:
    catboost_model = pickle.load(open(MODEL_PATH_CATBOOST, "rb"))
    xgboost_model  = pickle.load(open(MODEL_PATH_XGBOOST, "rb"))
except Exception as e:
    print(f"Ошибка загрузки моделей: {e}")
    catboost_model = None
    xgboost_model = None

class AddressRequest(BaseModel):
    address: str
    chain: Optional[str] = "ETH"  # по умолчанию Ethereum

@app.get("/")
def root():
    return {"message": "OpenAML Demo API работает. Используй POST /check-address"}

@app.post("/check-address")
def check_address(req: AddressRequest):
    if not catboost_model or not xgboost_model:
        raise HTTPException(status_code=500, detail="Модели не загружены")

    # Здесь должна быть реальная предобработка адреса → признаки
    # Пока заглушка (замени на реальный feature extraction из твоих ноутбуков)
    features = pd.DataFrame([{
        "address": req.address,
        "chain": req.chain,
        # Добавь реальные признаки: tx_count, volume, unique_counterparties и т.д.
        "tx_count": 150,
        "total_volume_usd": 120000,
        "unique_counterparties": 45,
        # ... другие признаки
    }])

    # Inference (пример — используй нужную модель)
    try:
        pred_cat = catboost_model.predict_proba(features)[:, 1]  # вероятность риска
        pred_xgb = xgboost_model.predict_proba(features)[:, 1]

        avg_risk = (pred_cat[0] + pred_xgb[0]) / 2
        category = "High Risk" if avg_risk > 0.7 else "Medium Risk" if avg_risk > 0.3 else "Low Risk"

        return {
            "address": req.address,
            "chain": req.chain,
            "risk_score": round(float(avg_risk), 4),
            "category": category,
            "note": "Это демо-заглушка. В реальном проекте добавь feature extraction."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка inference: {str(e)}")
