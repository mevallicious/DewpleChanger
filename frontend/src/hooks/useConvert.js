import { useSelector, useDispatch } from 'react-redux';
import { fetchVideoInfo, resetState } from '../state/convertSlice';
import { convertApi } from '../api/convertApi';

export const useConvert = () => {
  const dispatch = useDispatch();
  const { videoInfo, status, error } = useSelector((state) => state.convert);

  const fetchInfo = (url) => {
    dispatch(fetchVideoInfo(url));
  };

  const downloadAudio = (url) => {
    const downloadUrl = convertApi.getDownloadUrl(url);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    dispatch(resetState());
  };

  return {
    videoInfo,
    status,
    loading: status === 'loading',
    succeeded: status === 'succeeded',
    failed: status === 'failed',
    error,
    fetchInfo,
    downloadAudio,
    reset,
  };
};
