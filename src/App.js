import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import io from 'socket.io-client'
import ChatPage from './pages/ChatPage.js';
import Home from './pages/Home.js';
// import Register from './pages/Register.js';
// import Login from './pages/Login.js';

const socket = io.connect('http://103.195.236.149:5555')

function App() {
  return (
    <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<ChatPage socket={socket}/>}></Route>
          </Routes>
    </div>
    </BrowserRouter>
  );
}
// <Route path='/' element={<Home socket={socket}/>}></Route>

export default App;
