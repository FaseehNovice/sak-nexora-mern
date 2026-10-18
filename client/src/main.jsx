import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { EnquiryProvider } from './context/EnquiryContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <EnquiryProvider>
        <App />
      </EnquiryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
