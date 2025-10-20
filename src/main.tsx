import React from 'react';
import ReactDOM from 'react-dom/client';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import App from './App.tsx';

import '@mantine/core/styles.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      // withGlobalStyles
      // withNormalizeCSS
      theme={{
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <ColorSchemeScript />
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
