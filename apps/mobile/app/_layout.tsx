import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';

export default function RootLayout() {
  useEffect(() => {
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        enableInExpoDevelopment: true,
      });
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Toast />
      </PersistGate>
    </Provider>
  );
}