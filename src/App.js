import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import io from 'socket.io-client'
import ChatPage from './pages/ChatPage.js';
import Home from './pages/Home.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';

import socket from "./socket";


function App() {
  return (
    <BrowserRouter>
        <div>
          <Routes>
            {/* <Route path='/register' element={<Register socket={socket}/>}></Route> */}
            <Route path='/' element={<Home socket={socket}/>}></Route>
            <Route path="/chat" element={<ChatPage socket={socket}/>}></Route>
          </Routes>
    </div>
    </BrowserRouter>
  );
}
// <Route path='/' element={<Home socket={socket}/>}></Route>

export default App;
