export default function PredictionCard({ prediction }) {
  const isBeat = prediction.prediction === "beat";
  const isInsufficient = prediction.prediction === "insufficient_data";

  return (
    <div className={`prediction-card ${isBeat ? "beat" : isInsufficient ? "neutral" : "miss"}`}>
      <p className="pred-label">Next Earnings Prediction</p>
      {isInsufficient ? (
        <p className="pred-value neutral-text">Insufficient Data</p>
      ) : (
        <>
          <p className="pred-value">{isBeat ? "BEAT ↑" : "MISS ↓"}</p>
          <div className="confidence-bar-wrap">
            <div
              className="confidence-bar-fill"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
          <p className="pred-confidence">{prediction.confidence}% confidence</p>
        </>
      )}
      {prediction.streak > 0 && (
        <p className="pred-streak">
          {prediction.streak}× {prediction.streak_direction} streak
        </p>
      )}
    </div>
  );
}
