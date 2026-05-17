export default function HistoryTable({ history }) {
  const display = [...history].reverse().slice(0, 12);

  return (
    <div className="table-section">
      <h3 className="section-title">Recent Quarters</h3>
      <div className="table-wrap">
        <table className="earnings-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reported EPS</th>
              <th>Estimated EPS</th>
              <th>Surprise</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {display.map((row, i) => (
              <tr key={i}>
                <td className="date-cell">{row.date.slice(0, 10)}</td>
                <td>${row.reported}</td>
                <td>${row.estimated}</td>
                <td className={row.beat ? "beat-text" : "miss-text"}>
                  {row.surprise_pct > 0 ? "+" : ""}{row.surprise_pct}%
                </td>
                <td>
                  <span className={`badge ${row.beat ? "badge-beat" : "badge-miss"}`}>
                    {row.beat ? "Beat" : "Miss"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
