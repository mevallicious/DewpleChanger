import axios from 'axios';

const API_BASE = '/api/v1/convert';

export const convertApi = {
  /**
   * Fetch video metadata (title, thumbnail, duration, etc.)
   * @param {string} url - The YouTube URL
   */
  async getInfo(url) {
    const response = await axios.post(`${API_BASE}/info`, { url });
    return response.data;
  },

  /**
   * Get the download URL for the MP3
   * @param {string} url - The YouTube URL
   */
  getDownloadUrl(url) {
    return `${API_BASE}/download?url=${encodeURIComponent(url)}`;
  }
};
