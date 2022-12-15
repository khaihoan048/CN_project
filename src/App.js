// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import Chat from './pages/Chat';
// import Login from './pages/Login';
// import SignUp from './pages/Signup';
//
// function App() {
//   return (
//       // <>
//       //   <Routes>
//       //     <Route exact path="/" element={<Login />}/>
//       //     <Route exact path="/chat" element={<Chat />}/>
//       //     <Route exact path="/signup" element={<SignUp />}/>
//       //   </Routes>
//       // </>
//
//       <Chat></Chat>
//   );
// }
// export default App;



import './App.css';
import Chat from './pages/Chat.js';
import Login from './pages/Login.js';
// import Register from './pages/Register.js';
import * as React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    window.g_app = this;
    this.state = {pageType: 'login', userName : '', flag: true};



  }
  setChatPage() {
    this.setState({pageType: 'chat'});
  }

  setUserInfo(infoObject) {
    this.setState({userName: infoObject.userName});
  }
  render() {
    if (this.state.pageType === 'login') {
      return <Login parentApp={this}/>;
    }
    // else if (this.state.pageType === 'register'){
    //   return <Register parentApp={this}/>;
    // }
    else if (this.state.pageType === 'chat'){
      return <Chat/>;
    }
    else return null;
  };
}

