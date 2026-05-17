export default function StatsRow({ prediction }) {
  const stats = [
    { label: "Beat Rate", value: `${prediction.beat_rate}%` },
    { label: "Avg Surprise", value: `${prediction.avg_surprise > 0 ? "+" : ""}${prediction.avg_surprise}%` },
    { label: "Trend", value: prediction.trend > 0 ? `↑ Improving` : `↓ Declining` },
  ];

  return (
    <div className="stats-row">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <p className="stat-label">{s.label}</p>
          <p className="stat-value">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
