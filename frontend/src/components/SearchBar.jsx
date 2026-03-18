import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export const SearchBar = ({ onConvert, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onConvert(url.trim());
    }
  };

  return (
    <div className="search-container animate-fade-in">
      <form onSubmit={handleSubmit} className="search-form glass-panel">
        <div className="input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="url"
            placeholder="Paste a YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            required
            className="search-input"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="convert-btn"
        >
          {isLoading ? (
            <>
              <Loader2 className="spinner" size={18} />
              <span>Checking...</span>
            </>
          ) : (
            <span>Convert</span>
          )}
        </button>
      </form>
    </div>
  );
};
