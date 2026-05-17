import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="tt-date">{label}</p>
        <p className="tt-row">Reported: <strong>${d.reported}</strong></p>
        <p className="tt-row">Estimated: <strong>${d.estimated}</strong></p>
        <p className={`tt-surprise ${d.beat ? "beat-text" : "miss-text"}`}>
          {d.surprise_pct > 0 ? "+" : ""}{d.surprise_pct}% surprise
        </p>
      </div>
    );
  }
  return null;
};

export default function EarningsChart({ history }) {
  const display = [...history].slice(-12);

  return (
    <div className="chart-section">
      <h3 className="section-title">Earnings Surprise History</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={display} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#888" }}
            tickFormatter={(v) => v.slice(0, 7)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#888" }}
            tickFormatter={(v) => `${v}%`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="rgba(0,0,0,0.2)" />
          <Bar dataKey="surprise_pct" radius={[3, 3, 0, 0]}>
            {display.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.beat ? "#16a34a" : "#dc2626"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="chart-note">
        <span className="beat-dot" /> Beat &nbsp;&nbsp;
        <span className="miss-dot" /> Miss
      </p>
    </div>
  );
}
