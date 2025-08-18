import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';
import userReducer from './userSlice';
import queueReducer from './queueSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'queue'],
};

const rootReducer = {
  user: userReducer,
  queue: queueReducer,
  [api.reducerPath]: api.reducer,
};

const persistedReducer = persistReducer(persistConfig, (state, action) => {
  // Root reducer for persist
  let s = state ?? {};
  Object.keys(rootReducer).forEach((k) => {
    s[k] = rootReducer[k](s[k], action);
  });
  return s;
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;