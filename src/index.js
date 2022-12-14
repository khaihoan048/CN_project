import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';



window.g_peer = null;
window.g_dictDC = null;
window.g_userName = null;
window.g_iceconfig = {'iceServers': [
  { url: 'stun:stun.l.google.com:19302' },
  {
      urls: "stun:openrelay.metered.ca:80",
  },
  {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
  },
  {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
  },
  {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
  }
]};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
