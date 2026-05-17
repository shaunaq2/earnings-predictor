import { useState } from "react";
import SearchBar from "./components/SearchBar";
import PredictionCard from "./components/PredictionCard";
import EarningsChart from "./components/EarningsChart";
import HistoryTable from "./components/HistoryTable";
import StatsRow from "./components/StatsRow";
import "./index.css";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (ticker) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch(`http://localhost:8000/api/earnings/${ticker}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to fetch data");
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">EarningsEdge</span>
          </div>
          <p className="tagline">ML-powered earnings surprise prediction</p>
        </div>
      </header>

      <main className="main">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Fetching earnings history...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <span className="error-icon">⚠</span>
            <p>{error}</p>
          </div>
        )}

        {data && !loading && (
          <div className="results">
            <div className="company-header">
              <div>
                <h2 className="company-name">{data.name}</h2>
                <p className="company-meta">
                  <span className="ticker-badge">{data.ticker}</span>
                  {data.sector && <span className="sector">{data.sector}</span>}
                </p>
              </div>
            </div>

            <div className="top-grid">
              <PredictionCard prediction={data.prediction} />
              <StatsRow prediction={data.prediction} />
            </div>

            <EarningsChart history={data.history} />
            <HistoryTable history={data.history} />
          </div>
        )}

        {!searched && !loading && (
          <div className="empty-state">
            <p className="empty-hint">Try <button className="hint-btn" onClick={() => handleSearch("AAPL")}>AAPL</button>, <button className="hint-btn" onClick={() => handleSearch("NVDA")}>NVDA</button>, or <button className="hint-btn" onClick={() => handleSearch("TSLA")}>TSLA</button></p>
          </div>
        )}
      </main>
    </div>
  );
}
