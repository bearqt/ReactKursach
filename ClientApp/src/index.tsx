import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import axios from 'axios';

axios.interceptors.request.use((request) => {
  request.withCredentials = true;
  return request;
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
