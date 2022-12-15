import React, { useState } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  ConversationHeader,
  Avatar,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
  ExpansionPanel,
  TypingIndicator,
  MessageSeparator,
  EllipsisButton
} from "@chatscope/chat-ui-kit-react";

// import MyPeer from "./MyPeer.js";
import Peer from "peerjs";

export default function Chat() {
    let userList = require("../data/user.json");
    for (let user of userList) {
        window.g_dictMessage[user.userName] = require('../data/mess/' + user.name + '.json');
    }

    const [messageInputValue, setMessageInputValue] = useState("");
    const [currentContact, setCurrentContact] = useState(userList[1]);
    const [currentContactUserName, setCurrentContactUserName] = useState(userList[1].name); 
    const [binaryFlag, setBinaryFlag] = useState(true);



    class MyPeer extends Peer {
        constructor() {
            super(window.g_userName, {config : window.g_iceconfig});
            this.isOpen = false;
            console.log('create peer');
            this.dataConnectionDict = {};
            this.on('open', function(id) {
                console.log('open ' + id);
                this.isOpen = true;
            });
    
            this.on('disconnected', () => {
                while (this.disconnected) {
                    console.log('disconnect');
                    this.reconnect();
                    console.log('succesful reconnect to peerjs server:? ' + !this.disconnected);
                }
            });
    
            this.on('connection', function(dataConnection) {
                this.dataConnectionDict[dataConnection.peer] = dataConnection;
                let dc = this.dataConnectionDict[dataConnection.peer];
                this.addHandlerForDc(dc);
                console.log('receive connection from remote peer');
            });
        }
    
        addHandlerForDc(dc) {
            function handleData(data) {
                if (data.message) {
                    if (!window.g_dictMessage[data.sender]) window.g_dictMessage[data.sender]= [];
                    window.g_dictMessage[data.sender].push(data);
                    setBinaryFlag(!binaryFlag);
                }
                console.log('receive' + data);
            }
            dc.on('open', function() {
                dc.reliable = true; //
                dc.serialization = 'json';
                console.log('dc open and isready to use');
                dc.on('data', handleData);
            });
            dc.on('data', handleData);
        }
    }
    
    
  // Set initial message input value to empty string
    if (!window.g_peer || window.g_peer.destroyed) {
        if (window.g_peer) {
            window.g_peer.destroy();
        }
        window.g_peer = new MyPeer();
    }
    

  

  return (
    <div
      style={{
        height: "600px",
        position: "relative"
      }}
    >
      <MainContainer responsive>
        <Sidebar position="left" scrollable={true}>
          <Search placeholder="Search..." />
          <ConversationList>

            {
                userList.map(function(user){
                    return (
                        <Conversation
                            name={user.name}
                            onClick = {function() {
                                let myPeer = window.g_peer;
                                let conversationId = user.userName;
                                if (!(window.g_peer) || window.g_peer.destroyed) {
                                    if (window.g_peer) window.g_peer.destroy();
                                        myPeer = window.g_peer = new MyPeer();
                                }
                                let dc = myPeer.dataConnectionDict[user.userName];
                                if (!(dc && dc.peerConnection && dc.peerConnection.iceConnectionState == 'connected')) {
                                    window.g_peer.dataConnectionDict[conversationId] = window.g_peer.connect(conversationId);
                                    dc = window.g_peer.dataConnectionDict[conversationId];
                                    window.g_peer.addHandlerForDc(dc);
                                }
                                setCurrentContact(user);
                                setCurrentContactUserName(user.userName);
                            }}
                            >
                        <Avatar
                            src={
                                "https://chatscope.io/storybook/react/static/media/lilly.62d4acff.svg"
                                }
                            name={user.userName}
                            status="available"
                        />
                        </Conversation>
                    )
                })
            }

          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              src={
                "https://chatscope.io/storybook/react/static/media/lilly.62d4acff.svg"
              }
              name={currentContactUserName}
            />
            <ConversationHeader.Content
              userName={currentContact.name}
              info="Active 10 mins ago"
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList >
            <MessageSeparator content={Date()} />
            {
                
                window.g_dictMessage[currentContactUserName].map(function(mess) {
                    return (
                        <Message
                            model={{
                                message: mess.message,
                                sentTime: mess.sentTime,
                                sender: mess.sender,
                                direction: window.g_userName === mess.sender ? "outgoing" : "incoming",
                                position: "normal"
                            }}
                        />
                    )
                })                
            }
            
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={messageInputValue}
            onChange={(val) => setMessageInputValue(val)}
            onSend={function(message) {
                let myPeer = window.g_peer;
                let conversationId = currentContactUserName;
                if (!(window.g_peer) || window.g_peer.destroyed) {
                    if (window.g_peer) window.g_peer.destroy();
                    window.g_peer = new MyPeer();
                }
                let dc = window.g_peer.dataConnectionDict[conversationId];
                if (!(dc && dc.peerConnection && dc.peerConnection.iceConnectionState == 'connected')) {
                    window.g_peer.dataConnectionDict[conversationId] = window.g_peer.connect(conversationId);
                    dc = window.g_peer.dataConnectionDict[conversationId];
                    window.g_peer.addHandlerForDc(dc);
                }
                let messObj = {
                    "message": message,
                    "sentTime": Date(),
                    "sender": window.g_userName
                }
                dc.send(messObj);
                if (!window.g_dictMessage[conversationId]) window.g_dictMessage[conversationId]= [];
                let data = messObj;
                window.g_dictMessage[conversationId].push(data);
                setMessageInputValue('');
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};




// export default function Chat() {

//     if (!window.g_peer || window.g_peer.destroyed) {
//         if (window.g_peer) {
//             window.g_peer.destroy();
//         }
//         window.g_peer = new MyPeer();
//     }


//     const [messageInputValue, setMessageInputValue] = useState("");
//     const [currentFriendName, setCurrentFriendName] = useState("hello2");
//     // const [dictMessage, setDictMessage] = useState(new Map());
//     // const [renderSwitch, setRenderSwitch] = useState(true);
//     // useEffect()

//     let userList = require('../data/user.json');
//     const avatarIco =
//         "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAZlBMVEUOHCyclYufmI0AECZvbGkAACCjm5AIGCoxOUIAEycAFSgLGisNHCwEFykDFyljY2N9enUlLjkACCKWkIc+Q0lmZmWIhH0bJjN/e3YVIjGSjYRAREpbXF0tND54dXGEgHpKTVFTVVcfARIMAAADVklEQVR4nO3ciXaiMABA0ZA4lhBEcV+r/v9PTtA6FUVGLXOyzLtf4DtktVghAAAAAAAAAAAAAAAAAAAAAABAuIwej9XAuP4Y/4xR5XY+6U11pI1GL4ZrmSQyGaXZIHf9cTqXa7Gt+ipSfqZ64PoTdcuoYjj56js3jtJxRM/RqMUwueo7Ny6nqohjPtr1Zbi+6Ts1JqNpFsGak2eLxr5z4zItAp+PRtfn313jaT66/pTvM2p1N//uGvv7YOdjNf/ant/VWJ3qABsv+/szzmtOWHtHrldP950a7XwM6QxglJk9Mz7rjcvpOJCxWs2/v60vzY37qc78b7R9s1fGZ60xWW58PwMYu7+/Oj5vGr0+A9yer99qrM4AheuSZnZ/n8kf9p0a7RnAyzVHly+vnw8bq/no3faYbd5dX5obe749xNy8s0G0NW6166a6bNttYJJMxq6b6lSv68L+L9dNdRRSSKF7FFJIoXsUUkihexRSSKF7FFJIoXsUUkihexRSSKF7FFJIoXsUUkihexRSSKF7FL5Oxl4oR8p1U13XhXJdevb6ZbeFUo5K396E7rJQyvlBfLguutVdoUyWB+PfO9BdFUopZztV+NfXUaHs749KebbCXHTwFrScfKbGs5e7r5iy/7M8uR7ulNe/0Bt//uTHQNXq6evwvMjz+buJMumlYw9Xz1sfi7cS7ePbikB+XJntXk+Uk9FmpT0fnt+K3frFxzeZpdrLze+RbPdKX39+XKmPkPqsLJ0825d82tUlmOH5LZs+k2gf37DMwlhd7mSbJx7f/mBXl8CG5x+5PvzlcCP3UxXi8Pymju17xjys1bOJaj2Ey6O/h+tnGT1s+38taaArzLU8m7Ukpt59P/GGvO0+HEWhMC13qTgKRV48TIykUBgxepAYS6Ew+b45MZpCu2k0XxfjKRRm1ZgYUaEoyqbEmArtjbjhv4FEVdh46Y+rsCkxskKhN7eX/tgKhTrEXmgTZeSFuap/rxFf4e33GjEW1i/9MRbWL/1RFopc9/pxF15/rxFpoR2ol0t/rIX2Rvx16Y+20F4Xz5f+eAvtUzxdFyMuFKaw10Xp2zuHnRqU8/5chf53mVaDxSHqRyiqgRp5IAAAAAAAAAAAAAAAAAAAAAAA/4Hf0gU2cK/EibwAAAAASUVORK5CYII=";



//             return <div style={{
//             height: "600px",
//             position: "relative"
//         }}>
//             <MainContainer responsive>
//             <Sidebar position="left" scrollable={false}>
//             <Search placeholder="Search..." />
//             <ConversationList>
//             <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
//             <Avatar src={avatarIco} name="Lilly" status="available" />
//             </Conversation>

//             <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
//             <Avatar src={avatarIco} name="Joe" status="dnd" />
//             </Conversation>

//             <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you" unreadCnt={3}>
//             <Avatar src={avatarIco} name="Emily" status="available" />
//             </Conversation>

//             <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you" unreadDot>
//             <Avatar src={avatarIco} name="Kai" status="unavailable" />
//             </Conversation>

//             <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you">
//             <Avatar src={avatarIco} name="Akane" status="eager" />
//             </Conversation>

//             <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you">
//             <Avatar src={avatarIco} name="Eliot" status="away" />
//             </Conversation>

//             <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you">
//             <Avatar src={avatarIco} name="Zoe" status="dnd" />
//             </Conversation>

//             <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you">
//             <Avatar src={avatarIco} name="Patrik" status="invisible" />
//             </Conversation>
//             </ConversationList>
//             </Sidebar>

//             <ChatContainer>
//             <ConversationHeader>
//             <ConversationHeader.Back />
//             <Avatar src={avatarIco} name="Zoe" />
//             <ConversationHeader.Content userName="Zoe" info="Active 10 mins ago" />
//             <ConversationHeader.Actions>
//             <VoiceCallButton />
//             <VideoCallButton />
//             <EllipsisButton orientation="vertical" />
//             </ConversationHeader.Actions>
//             </ConversationHeader>
//             <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
//             <MessageSeparator content="Saturday, 30 November 2019" />
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Zoe",
//             direction: "incoming",
//             position: "single"
//         }}>
//             <Avatar src={avatarIco} name="Zoe" />
//             </Message>
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Patrik",
//             direction: "outgoing",
//             position: "single"
//         }} avatarSpacer />
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Zoe",
//             direction: "incoming",
//             position: "first"
//         }} avatarSpacer />
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Zoe",
//             direction: "incoming",
//             position: "normal"
//         }} avatarSpacer />
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Zoe",
//             direction: "incoming",
//             position: "normal"
//         }} avatarSpacer />
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Zoe",
//             direction: "incoming",
//             position: "last"
//         }}>
//             <Avatar src={avatarIco} name="Zoe" />
//             </Message>
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Patrik",
//             direction: "outgoing",
//             position: "first"
//         }} />
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Patrik",
//             direction: "outgoing",
//             position: "normal"
//         }} />
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Patrik",
//             direction: "outgoing",
//             position: "normal"
//         }} />
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Patrik",
//             direction: "outgoing",
//             position: "last"
//         }} />

//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Zoe",
//             direction: "incoming",
//             position: "first"
//         }} avatarSpacer />
//             <Message model={{
//             message: "Hello my friend",
//             sentTime: "15 mins ago",
//             sender: "Zoe",
//             direction: "incoming",
//             position: "last"
//         }}>
//             <Avatar src={avatarIco} name="Zoe" />
//             </Message>
//             </MessageList>
//             <MessageInput placeholder="Type message here" value={messageInputValue} onChange={val => setMessageInputValue(val)} />
//             </ChatContainer>
//             </MainContainer>
//             </div>;
//         }
// import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";