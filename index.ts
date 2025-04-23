import { Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import { createRoot } from 'react-dom/client';
import App from './App';
import { createElement } from 'react';

if (Platform.OS === 'web') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(createElement(App));
  }
} else {
  registerRootComponent(App);
}
