# Stablecoin Multi-Class Models (v2)

The OpenAML Stablecoin Model Suite (v2) is the latest evolution of blockchain-based financial crime detection technology developed under the FINOS OpenAML Research Initiative.

This version introduces a multi-class architecture capable of identifying and classifying wallets as Normal, Hack/Phishing, or Sanctioned/Blocked across the Ethereum USDT and USDC ecosystems.

Trained on more than 330 million stablecoin transfers and 55 million unique wallets, these models deliver production-grade precision, leveraging behavioral, network, and transactional features that mirror the three classical stages of money laundering — placement, layering, and dispersion.



### Highlights

Three-class AML framework distinguishing sanctioned addresses from cybercrime-related wallets.

Tree-based ensembles (LightGBM, CatBoost, XGBoost, Random Forest) achieving near-perfect accuracy.

Neural and Graph Neural Networks extending detection to indirect and multi-hop laundering patterns.

Integrated early stopping, hyperparameter optimization, and class weighting for performance stability.

Designed to comply with evolving global AML frameworks, including MiCA (EU) and the GENIUS Act (US).

### Model Performance Overview

| Model | AUROC | Accuracy | F1 Score | Recall |
| :--- | :---: | :---: | :---: | :---: |
| Logistic Regression (bench) | 0.9385 | 0.8387 | 0.7831 | 0.7499 |
| Random Forest | 0.9976 | 0.9824 | 0.9714 | 0.9708 |
| LightGBM | 0.9976 | 0.9845 | 0.9755 | 0.9742 |
| CatBoost | 0.9974 | 0.9857 | 0.9775 | 0.9757 |
| XGBoost | 0.9974 | 0.9851 | 0.9766 | 0.9760 |
| Dense Neural Network (PyTorch) | 0.9656 | 0.9337 | 0.8999 | 0.8868 |
| Graph Neural Network (GraphSAGE) | 0.9737 | 0.9209 | 0.8941 | 0.8787 |

The  tree-based ensemble models remain the gold standard for stablecoin AML — combining high accuracy, efficiency, and interpretability.
While deep and graph neural networks capture additional relational complexity, ensemble methods continue to outperform in large-scale, tabular datasets.

### Engineered Feature Library
**Engineered features capturing wallet behaviors and interactions**

| Feature Name | Description | Source |
| :--- | :--- | :--- |
| isWallet | Address has no bytecode (externally owned account) | Direct |
| isVerifiedContract | Smart contract with verified source code | Direct |
| isPartOfClusterFrom | Sends funds with same value and destination as other addresses | Transfer |
| isPartOfClusterTo | Receives funds with same value and origin as other addresses | Transfer |
| receivedFromFlagged | Received funds from a flagged address | Transfer |
| sentToFlagged | Sent funds to a flagged address | Transfer |
| sentToDefi | Sent funds to a DeFi protocol | Transfer |
| sentToLending | Sent funds to a lending protocol | Transfer |
| sentToSwap | Sent funds to a swap protocol | Transfer |
| sentToCex | Sent funds to a centralized exchange | Transfer |
| sentToDex | Sent funds to a decentralized exchange | Transfer |
| sentToCustody | Sent funds to a cold wallet or treasury | Transfer |
| receivedFromCustody | Received funds from a cold wallet or treasury | Transfer |
| receivedFromDex | Received funds from a decentralized exchange | Transfer |
| receivedFromCex | Received funds from a centralized exchange | Transfer |
| receivedFromSwap | Received funds from a swap protocol | Transfer |
| receivedFromLending | Received funds from a lending protocol | Transfer |
| receivedFromDefi | Received funds from a DeFi protocol | Transfer |
| sentToSC | Sent funds to a smart contract | Transfer |
| receivedFromSC | Received funds from a smart contract | Transfer |
| receiveSingleFrom | Multiple transfers from a single address | Transfer |
| sentToSingleAddress | Multiple transfers to a single address | Transfer |
| receiveMultipleSameValue | Received multiple transfers with the same value | Transfer |
| sentMultipleSameValue | Sent multiple transfers with the same value | Transfer |
| transferOver1k | Transfer over 1,000 USD-equivalent | Transfer |
| transferOver5k | Transfer over 5,000 USD-equivalent | Transfer |
| transferOver10k | Transfer over 10,000 USD-equivalent | Transfer |
| hasProxyBehaviour | Received and sent the same amount within the same day | Transfer |
| hasMixerBehaviour | Imbalance between sent and received volumes (mixer pattern) | Transfer |
| sentToStake | Sent funds to a staking protocol | Transfer |
| receivedFromStake | Received funds from a staking protocol | Transfer |
| sentToBet | Sent funds to a betting protocol | Transfer |
| receivedFromBet | Received funds from a betting protocol | Transfer |
| sentToPayment | Sent funds to a payment service | Transfer |
| receivedFromPayment | Received funds from a payment service | Transfer |
| usedWithDao | Interacted with a DAO address | Transfer |
| usedWithAirdrop | Interacted with an airdrop participant | Transfer |
| isLongTermWallet | Active across more than 3 months | Transaction |
| hasKYC | Interacted with a protocol requiring KYC | Transaction |
| 2ndWithFlagged | Second-degree connection with flagged address | Derived |
| 2ndWithDefi | Second-degree connection with DeFi protocol | Derived |
| 2ndWithLending | Second-degree connection with lending protocol | Derived |
| 2ndWithSwap | Second-degree connection with swap protocol | Derived |
| 2ndWithStaking | Second-degree connection with staking protocol | Derived |
| 2ndWithCex | Second-degree connection with centralized exchange | Derived |
| 2ndWithDex | Second-degree connection with decentralized exchange | Derived |
| 2ndWithCustody | Second-degree connection with cold wallet | Derived |
| 2ndWithMixerBehaviour | Second-degree connection with mixer behavior | Derived |
| highFrequencySameDay | More than 10 transfers in the same day | Derived |
| circleTransferDetected | Reciprocal transfers within 24 hours | Derived |
| clusterScore | Number of flagged direct connections | Derived |
| sentToProxy | Sent funds to proxy wallet | Derived |
| receivedFromProxy | Received funds from proxy wallet | Derived |
| sentToMixer | Sent funds to mixer service | Derived |
| receivedFromMixer | Received funds from mixer service | Derived |
| 2ndWithProxy | Second-degree connection with proxy wallet | Derived |
| 2ndWithMixer | Second-degree connection with mixer | Derived |
| 2ndWithSC | Second-degree connection with smart contract | Derived |
| 2ndWithCluster | Second-degree connection with clustered wallets | Derived |
| 3rdWithFlagged | Third-degree connection with flagged wallet | Derived |
| 2ndWithMultipleSameValue | Second-degree connection with repetitive same-value transfers | Derived |
| 2ndWithSingleFrom | Second-degree connection with single outgoing wallet | Derived |
| 2ndWithSingleTo | Second-degree connection with single receiving wallet | Derived |
| 2ndWithOver1k | Second-degree connection with >1k transfer | Derived |
| 2ndWithOver5k | Second-degree connection with >5k transfer | Derived |
| 2ndWithOver10k | Second-degree connection with >10k transfer | Derived |
| 2ndWithBet | Second-degree connection with betting wallet | Derived |
| 2ndWithPayment | Second-degree connection with payment wallet | Derived |

### Usage Example

Developers and researchers can easily load and evaluate any trained model using the provided Python utilities:

```python
import torch
import pandas as pd
from sklearn.preprocessing import StandardScaler
from model import DenseNeuralNetwork  # or GraphSAGE, LightGBM, etc.

# Load preprocessed dataset
df = pd.read_csv("data.csv")
X = df.drop(columns=["wallet", "label"], errors="ignore")
y = df["label"]

# Apply same scaler used during training
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Load trained model
model = DenseNeuralNetwork(input_size=X_scaled.shape[1], hidden_size=256, dropout=0.2)
model.load_state_dict(torch.load("models/neural_network_best.pth", map_location="cpu"))
model.eval()

# Predict
with torch.no_grad():
    preds = model(torch.tensor(X_scaled, dtype=torch.float32))
    y_pred = preds.argmax(dim=1).numpy()

```

All models, datasets, and training pipelines are maintained in the OpenAML GitHub repository to promote reproducibility, open innovation, and regulatory transparency in blockchain-based AML research.