import React from 'react';
import ReactDOM from 'react-dom/client'; // 또는 ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <App />
  </React.StrictMode>
);
