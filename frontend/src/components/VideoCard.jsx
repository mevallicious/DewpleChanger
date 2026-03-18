import React from 'react';
import { Download, PlayCircle, Clock } from 'lucide-react';

export const VideoCard = ({ videoInfo, onDownload, isDownloading }) => {
  if (!videoInfo) return null;

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
        {videoInfo.duration && (
          <div className="video-meta">
            <Clock size={16} className="meta-icon" />
            <span>{videoInfo.duration}</span>
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
