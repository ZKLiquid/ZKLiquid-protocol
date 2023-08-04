import React from 'react';
import ReactDOM from 'react-dom/client';

import Wagmi from './Wagmi';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Wagmi>
      <App />
      <ToastContainer
        hideProgressBar
        pauseOnHover={false}
        position="bottom-right"
        theme="dark"
      />
    </Wagmi>
  </React.StrictMode>
);
