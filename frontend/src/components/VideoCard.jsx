import React from 'react';
import { Download, PlayCircle, Clock } from 'lucide-react';

const formatDuration = (seconds) => {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const VideoCard = ({ videoInfo, onDownload, isDownloading }) => {
  if (!videoInfo) return null;

  const formattedDuration = formatDuration(videoInfo.duration);

  return (
    <div className="video-card glass-panel animate-fade-in">
      <div className="thumbnail-container">
        <img 
          src={videoInfo.thumbnail} 
          alt={videoInfo.title} 
          className="thumbnail-image"
        />
        <div className="play-overlay">
          <PlayCircle size={48} className="play-icon" />
        </div>
      </div>
      
      <div className="video-info">
        <h3 className="video-title">{videoInfo.title}</h3>
        {formattedDuration && (
          <div className="video-meta">
            <Clock size={16} className="meta-icon" />
            <span>{formattedDuration}</span>
          </div>
        )}
        
        <button 
          onClick={onDownload} 
          disabled={isDownloading}
          className="download-btn"
        >
          <Download size={18} className="download-icon" />
          <span>Download MP3</span>
        </button>
      </div>
    </div>
  );
};
