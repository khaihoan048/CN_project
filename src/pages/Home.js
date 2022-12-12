import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"

const Home = ({socket}) => {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem("userName", userName)
        onUsernameSelection(userName);
        // socket.emit("newUser", {userName, socketID: socket.id})
        navigate("/chat");

    }
    function onUsernameSelection(username) {
      // this.usernameAlreadySelected = true;
      socket.auth = { username };
      socket.connect();
    }

    socket.on("connect_error", (err) => {
      // if (err.message === "invalid username") {
      //   // this.usernameAlreadySelected = false;
      // }
      console.log('Invalid username');
    });

    socket.off("connect_error");

  return (
    <form className='home__container' onSubmit={handleSubmit}>
        <h2 className='home__header'>Sign in to Open Chat</h2>
        <label htmlFor="username">Username</label>
        <input type="text" 
        minLength={6} 
        name="username" 
        id='username'
        className='username__input' 
        value={userName} 
        onChange={e => setUserName(e.target.value)}
        />
        <button className='home__cta'>SIGN IN</button>
    </form>
  )
}

export default Home