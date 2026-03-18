import React from 'react';
import { SearchBar } from './components/SearchBar';
import { VideoCard } from './components/VideoCard';
import { ErrorBanner } from './components/ErrorBanner';
import { useConvert } from './hooks/useConvert';
import { Music3, Zap, Shield, Headphones, CheckCircle2 } from 'lucide-react';
import './index.css';

function App() {
  const { videoInfo, loading, error, fetchInfo, downloadAudio } = useConvert();

  const handleConvert = (url) => {
    fetchInfo(url);
  };

  const handleDownload = () => {
    if (videoInfo && videoInfo.url) {
        downloadAudio(videoInfo.url);
    }
  };

  return (
    <div className="app-container">
      {/* Background Decorative Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <header className="app-header animate-fade-in">
        <div className="logo-container">
          <div className="logo-icon-wrapper">
            <Music3 size={32} className="logo-icon text-pink-500" />
          </div>
          <h1 className="app-title">
            Tube<span className="gradient-text">MP3</span>
          </h1>
        </div>
        <p className="app-subtitle">
          Transform your favorite YouTube videos into pristine audio files in seconds. Download high-quality MP3s with zero ads or popups.
        </p>
      </header>

      <main className="main-content">
        <section className="conversion-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <SearchBar onConvert={handleConvert} isLoading={loading} />
          
          <div className="results-container">
            <ErrorBanner error={error} />
            {videoInfo && (
              <VideoCard 
                videoInfo={videoInfo} 
                onDownload={handleDownload}
              />
            )}
          </div>
        </section>

        {!videoInfo && !loading && (
          <>
            <section className="features-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="section-header">
                <h2>Why Choose TubeMP3?</h2>
                <p>The most reliable and fastest converter on the web.</p>
              </div>
              
              <div className="features-grid">
                <div className="feature-card glass-panel">
                  <div className="feature-icon-wrapper pulse-bg">
                    <Zap size={24} color="#ff003c" />
                  </div>
                  <h3>Lightning Fast</h3>
                  <p>Our dedicated transcoding servers convert videos to MP3 almost instantly.</p>
                </div>
                
                <div className="feature-card glass-panel">
                  <div className="feature-icon-wrapper pulse-bg">
                    <Headphones size={24} color="#ec4899" />
                  </div>
                  <h3>Premium Quality</h3>
                  <p>Downloads are processed at the highest available bitrate (up to 320kbps).</p>
                </div>
                
                <div className="feature-card glass-panel">
                  <div className="feature-icon-wrapper pulse-bg">
                    <Shield size={24} color="#22c55e" />
                  </div>
                  <h3>Safe & Secure</h3>
                  <p>No registration required. No tracking, malware, or annoying popups.</p>
                </div>
              </div>
            </section>

            <section className="how-it-works-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="section-header">
                <h2>How It Works</h2>
              </div>
              <div className="steps-container">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Copy URL</h4>
                    <p>Find your favorite video on YouTube and copy the link from the address bar.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Paste & Convert</h4>
                    <p>Paste the link into the search bar above and click Convert.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Download</h4>
                    <p>Click the download button to save the MP3 file directly to your device.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Music3 size={20} className="text-pink-500" />
            <span className="font-bold">TubeMP3</span>
          </div>
          <p className="footer-text">© {new Date().getFullYear()} TubeMP3 Converter. Fast, reliable, and premium.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
