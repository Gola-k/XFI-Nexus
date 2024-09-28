import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from "react-hot-toast"
import { Web3Provider } from './blockchain/WagmiProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
      <Toaster position='bottom-right' toastOptions={{
        style: {
          borderRadius: '5px',
          background: '#333',
          color: '#fff',
          fontFamily: "Arial, Helvetica, sans-serif",
        }
      }} />
    </Web3Provider>
  </React.StrictMode>
);
