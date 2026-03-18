import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { convertApi } from '../api/convertApi';

export const fetchVideoInfo = createAsyncThunk(
  'convert/fetchVideoInfo',
  async (url, { rejectWithValue }) => {
    try {
      const response = await convertApi.getInfo(url);
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch video info');
      }
      return { ...response.data, url };
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || 'Failed to fetch video info');
    }
  }
);

const initialState = {
  videoInfo: null,
  status: 'idle', 
  error: null,
};

const convertSlice = createSlice({
  name: 'convert',
  initialState,
  reducers: {
    resetState: (state) => {
      state.videoInfo = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoInfo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.videoInfo = null;
      })
      .addCase(fetchVideoInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videoInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchVideoInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred';
        state.videoInfo = null;
      });
  }
});

export const { resetState } = convertSlice.actions;
export default convertSlice.reducer;
