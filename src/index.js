import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';



window.g_app = null;
window.g_peer = null;
window.g_dictDC = null;
window.g_userName = null;
window.g_frame_message_list = null;
window.g_dictMessage = new Map();
window.g_app = null; 
window.g_cur_file = null;
window.g_transfer_file_state = true;
window.hash_name_file_table = new Map();


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
window.buttonFile = <label for="actual-btn" id="label">Choose File To Send</label>;

window.g_actualBtn = document.getElementById('actual-btn');
window.g_fileChosen = document.getElementById('file-chosen');


root.render(
    <Router>
        <App />
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
