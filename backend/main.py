from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings("ignore")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_earnings_data(ticker: str):
    stock = yf.Ticker(ticker)
    earnings = stock.earnings_history

    if earnings is None or earnings.empty:
        raise HTTPException(status_code=404, detail=f"No earnings data found for {ticker}")

    earnings = earnings.reset_index()
    results = []

    for _, row in earnings.iterrows():
        try:
            reported = float(row.get("epsActual", 0) or 0)
            estimated = float(row.get("epsEstimate", 0) or 0)
            surprise_pct = ((reported - estimated) / abs(estimated) * 100) if estimated != 0 else 0

            results.append({
                "date": str(row.get("quarterlyEarningsGrowthYOY", row.name))[:10] if "quarterlyEarningsGrowthYOY" in row else str(row.name)[:10],
                "reported": round(reported, 4),
                "estimated": round(estimated, 4),
                "surprise_pct": round(surprise_pct, 2),
                "beat": bool(reported >= estimated),
            })
        except Exception:
            continue

    return results


def predict_next(earnings_history: list) -> dict:
    if len(earnings_history) < 4:
        return {"prediction": "insufficient_data", "confidence": 0, "beat_rate": 0}

    surprises = [e["surprise_pct"] for e in earnings_history]
    beat_flags = [1 if e["beat"] else 0 for e in earnings_history]

    beat_rate = round(sum(beat_flags) / len(beat_flags) * 100, 1)
    avg_surprise = round(np.mean(surprises), 2)
    trend = round(np.polyfit(range(len(surprises)), surprises, 1)[0], 3)
    streak = 0
    for b in reversed(beat_flags):
        if b == beat_flags[-1]:
            streak += 1
        else:
            break

    features = np.array([[
        avg_surprise,
        trend,
        streak,
        beat_rate / 100,
        surprises[-1],
        surprises[-2] if len(surprises) > 1 else 0,
    ]])

    # Simple logistic score based on features
    score = (
        0.3 * (avg_surprise / 20) +
        0.2 * (trend / 5) +
        0.2 * (streak / 8) +
        0.3 * (beat_rate / 100)
    )
    probability = round(min(max(0.5 / (1 + np.exp(-score * 3)), 0.1), 0.95) * 100, 1)
    prediction = "beat" if probability >= 50 else "miss"

    return {
        "prediction": prediction,
        "confidence": probability if prediction == "beat" else round(100 - probability, 1),
        "beat_rate": beat_rate,
        "avg_surprise": avg_surprise,
        "trend": trend,
        "streak": streak,
        "streak_direction": "beat" if beat_flags[-1] == 1 else "miss",
    }


@app.get("/api/earnings/{ticker}")
def get_earnings(ticker: str):
    ticker = ticker.upper().strip()
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        name = info.get("longName") or info.get("shortName") or ticker
        sector = info.get("sector", "")
    except Exception:
        name = ticker
        sector = ""

    history = get_earnings_data(ticker)
    if not history:
        raise HTTPException(status_code=404, detail="No earnings data available")

    prediction = predict_next(history)

    return {
        "ticker": ticker,
        "name": name,
        "sector": sector,
        "history": history,
        "prediction": prediction,
    }


@app.get("/health")
def health():
    return {"status": "ok"}
