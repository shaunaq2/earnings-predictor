# EarningsEdge 📈

ML-powered earnings surprise predictor. Search any stock ticker to see its historical EPS beat/miss record and get a prediction for the next earnings report.

![EarningsEdge Screenshot](screenshot.png)

## Features

- **Earnings history** — beat/miss record with actual vs. estimated EPS and surprise % for every quarter
- **Prediction engine** — logistic model trained on beat rate, rolling trend, current streak, and recent surprise magnitude
- **Interactive chart** — bar chart of surprise % over time, color-coded by beat/miss
- **Live data** — pulls real earnings data from Yahoo Finance via `yfinance`

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Recharts, Vite |
| Backend | FastAPI, Python 3.11 |
| Data | yfinance (Yahoo Finance) |
| ML | scikit-learn (Logistic Regression), NumPy |

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## How the Prediction Works

The model scores each stock using four signals:

1. **Historical beat rate** — what % of past quarters did the company beat estimates
2. **Surprise trend** — linear slope of surprise % over recent quarters (improving vs. declining)
3. **Current streak** — how many consecutive beats or misses
4. **Recent surprise magnitude** — the last 1-2 quarters' actual surprise %

These features are combined into a weighted logistic score, producing a Beat/Miss prediction with a confidence percentage.

> Note: This is a side project for educational purposes. Not financial advice.

## Project Structure

```
earnings-predictor/
├── backend/
│   ├── main.py          # FastAPI app + ML logic
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── SearchBar.jsx
    │   │   ├── PredictionCard.jsx
    │   │   ├── StatsRow.jsx
    │   │   ├── EarningsChart.jsx
    │   │   └── HistoryTable.jsx
    │   └── index.css
    └── package.json
```
