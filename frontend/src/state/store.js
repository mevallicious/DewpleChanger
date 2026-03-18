import { configureStore } from '@reduxjs/toolkit';
import convertReducer from './convertSlice';

export const store = configureStore({
  reducer: {
    convert: convertReducer,
  },
});
