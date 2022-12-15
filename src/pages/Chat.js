import React, { useState, Component } from "react";
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
  EllipsisButton,
  AttachmentButton 
} from "@chatscope/chat-ui-kit-react";

// import MyPeer from "./MyPeer.js";
import Peer from "peerjs";
// import useForceUpdate from 'use-force-update';


// import send from 'peer-file.send';
// import receive from 'peer-file.receive'





export default function Chat() {

    



    // const forceUpdate = useForceUpdate();
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
            // this.forceUpdateAppFunction = forceUpdate;
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
                let connection = dataConnection;
                // receive(connection)
                //     .on('incoming', function(file) {
                //       this.accept(file) || this.reject(file)
                //     })
                //     .on('progress', function(file, bytesReceived) {
                //       Math.ceil(bytesReceived / file.size * 100)
                //     })
                //     .on('complete', function(file) {
                //       new Blob(file.data, { type: file.type })
                //     })

                // var file = input.files[0]
                //   send(connection, file)
                //     .on('progress', function(bytesSent) {
                //       Math.ceil(bytesSent / file.size * 100)
                //     })
            })
        }
    
        addHandlerForDc(dc) {
            function handleData(data) {
                if (data.message) {
                    if (!window.g_dictMessage[data.sender]) window.g_dictMessage[data.sender]= [];
                    window.g_dictMessage[data.sender].push(data);
                }
                // if(window.g_frame_message_list) window.g_frame_message_list.setState({binaryFlag: !binaryFlag});              
                // useForceUpdate();
                window.g_app.setState({flag: !window.g_app.state.flag});
                // window.g_dictMessage[data.sender].pop();
                console.log('receive' + data);
            }
            dc.on('open', function() {
                dc.reliable = true; //
                dc.serialization = 'json';
                console.log('dc open and isready to use');
                dc.on('data', handleData);
                
            });
            // dc.on('data', handleData);
        }
    }
    
    
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
      <choose_file></choose_file>
      <span id="file-chosen"></span>
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
          {window.buttonFile}
          {   
              window.actualBtn.addEventListener('change', function(){
                  window.fileChosen.textContent = this.files[0].name;
              })
          }
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
            for="actual-btn"
            placeholder="Type message here"
            attachButton={false}
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
                    "sender": window.g_userName,
                    "type": "message"
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




