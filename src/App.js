import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import io from 'socket.io-client'
import ChatPage from './pages/ChatPage.js';
import Home from './pages/Home.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';

const socket = io.connect("http://103.295.236.149:3245")

function App() {
  return (
    <BrowserRouter>
        <div>
          <Routes>
            <Route path='/' element={<Login socket={socket}/>}></Route>
            <Route path='/register' element={<Register socket={socket}/>}></Route>
            <Route path='/Home' element={<Home socket={socket}/>}></Route>
            <Route path="/chat" element={<ChatPage socket={socket}/>}></Route>
          </Routes>
    </div>
    </BrowserRouter>
  );
}
// <Route path='/' element={<Home socket={socket}/>}></Route>

export default App;
