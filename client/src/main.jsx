import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Motion from 'motion';
import App from './App.jsx';
import { EnquiryProvider } from './context/EnquiryContext.jsx';
import './styles/stage/css/tokens.css';
import './styles/stage/css/base.css';
import './styles/stage/css/components.css';
import './styles/stage/css/chrome.css';
import './styles/stage/css/catalogue.css';
import './styles/stage/css/home.css';
import './styles/stage/css/motion.css';
import './index.css';

if (typeof window !== 'undefined') {
  window.Motion = Motion;
  document.documentElement.classList.add('js');
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <EnquiryProvider>
        <App />
      </EnquiryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
