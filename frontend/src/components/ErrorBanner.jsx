import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorBanner = ({ error }) => {
  if (!error) return null;

  return (
    <div className="error-banner animate-fade-in">
      <AlertCircle size={20} className="error-icon" />
      <span className="error-text">{error}</span>
    </div>
  );
};
