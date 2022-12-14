
import './App.css';
import ChatApp from './pages/ChatApp.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import * as React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {pageType: 'login', userName : ''};
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
    else if (this.state.pageType === 'register'){
      return <Register parentApp={this}/>;
    }
    else if (this.state.pageType === 'chat'){
      return <ChatApp userName={this.state.userName}/>;
    }
    else return null;
  };
}

