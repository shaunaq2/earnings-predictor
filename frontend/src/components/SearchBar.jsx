import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim().toUpperCase());
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <span className="search-icon">$</span>
        <input
          className="search-input"
          type="text"
          placeholder="Enter ticker symbol (e.g. AAPL)"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          disabled={loading}
          maxLength={10}
        />
        <button className="search-btn" type="submit" disabled={loading || !value.trim()}>
          {loading ? "..." : "Analyze"}
        </button>
      </div>
    </form>
  );
}
