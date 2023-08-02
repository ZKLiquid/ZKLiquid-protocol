import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import Wagmi from './Wagmi';

import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Wagmi>
      <App />
      <ToastContainer position="bottom-right" theme="dark" />
    </Wagmi>
  </React.StrictMode>
);
