import React, {useState, Component, useEffect} from "react";
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
    AttachmentButton,
    ArrowButton
} from "@chatscope/chat-ui-kit-react";

import {MyPeer} from "./MyPeer.js";


export default function Chat() {
    let userList = require("../data/user.json");
    for (let user of userList) {
        window.g_dictMessage[user.userName] = require('../data/mess/' + user.name + '.json');
    }
    if (!window.g_peer || window.g_peer.destroyed) {
        if (window.g_peer) {
            window.g_peer.destroy();
        }
        window.g_peer = new MyPeer();
    }
    const [messageInputValue, setMessageInputValue] = useState("");
    const [currentContact, setCurrentContact] = useState(userList[1]);
    const [currentContactUserName, setCurrentContactUserName] = useState(userList[1].name);
    const [binaryFlag, setBinaryFlag] = useState(true);


    // const [files, setFiles] = useState([]);
    // useEffect(() => {
    //     if (files.length > 0) {
    //         sendFile();
    //         setFiles([]);
    //         document.getElementById('actual-btn').value = null;
    //     }
    // }, [files])

    // const handleFile = (e) => {
    //     setFiles(e.target.files);
    // }

    // function saveToDisk(fileUrl, fileName, fileSize, mime) {
    //     var save = document.createElement('a');
    //     save.href = fileUrl;
    //     save.target = '_blank';
    //     save.download = fileName || fileUrl;
    //     save.addEventListener('click', (e) => {
    //         setTimeout(() => URL.revokeObjectURL(save.href));
    //     });
    //     save.click();
    // }

    window.g_sendFile = function(fileObj) {
        const blob = new Blob([fileObj]);
        let dc = window.g_peer.dataConnectionDict[currentContactUserName];
        if (!(dc && dc.peerConnection.iceConnectionState === "connected")) {
            dc = window.g_peer.connect(currentContactUserName);
            window.g_peer.dataConnectionDict[currentContactUserName] = dc;
        }
        window.g_peer.addHandlerForDc(dc, 'binary');
        let messFileObj = {
            "message": blob,
            "sentTime": Date(),
            "sender": window.g_userName,
            "type": "file",
            "fileName": window.g_cur_file,
            "fileSize": window.g_cur_file.size,
            "hashKey": fileObj.name + fileObj.lastModified + fileObj.size
        };
        dc.send(messFileObj);
        window.g_dictMessage[currentContactUserName].push(messFileObj);
        window.g_app.setState({flag: !window.g_app.state.flag});
    }

    window.g_download = function(file, filename) {
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
            url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
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
                    <Search placeholder="Search..."/>
                    <ConversationList>
                        {
                            userList.map(function (user) {
                                return (
                                    <Conversation
                                        name={user.name}
                                        onClick={function () {
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
                        window.g_actualBtn.addEventListener('change', function () {
                            // window.g_fileChosen.textContent = this.files[0].name;
                            // window.g_transfer_file_state = false;
                            window.g_cur_file = this.files[0];
                            window.g_sendFile(window.g_cur_file);
                        })


                        
                    }
                </Sidebar>

                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Back/>
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
                            <VoiceCallButton/>
                            <VideoCallButton/>
                            <InfoButton/>
                        </ConversationHeader.Actions>
                    </ConversationHeader>
                    <MessageList>
                        <MessageSeparator content={Date()}/>
                        {
                            window.g_dictMessage[currentContactUserName].map(function (mess) {
                                return (
                                    (mess.type == "message"
                                    ? (<Message
                                        model={{
                                            message: mess.message,
                                            sentTime: mess.sentTime,
                                            sender: mess.sender,
                                            direction: window.g_userName === mess.sender ? "outgoing" : "incoming",
                                            position: "normal"
                                        }}>
                                        <Avatar src={"https://chatscope.io/storybook/react/static/media/lilly.62d4acff.svg"} name={currentContactUserName} />
                                        </Message>)


                                    :(<Message
                                    model={{
                                      direction: window.g_userName === mess.sender ? "outgoing" : "incoming",
                                      type: "custom",
                                      sentTime: mess.sentTime
                                    }}
                                    avatarPosition="tl"
                                  >
                                    <Message.CustomContent>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center"
                                        }}
                                      >
                                        <div
                                          style={{
                                            marginRight: 8
                                          }}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            fill="#ffffff"
                                            class="bi bi-file-earmark-fill"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
                                          </svg>
                                          <br />
                                          <span style={{ fontSize: 8 }}>{mess.fileSize + " bytes"}</span>
                                        </div>
                                        <div>
                                          <span style={{ color: "#fff" }}>{mess.fileName}</span>
                                        </div>
                                        <div
                                            style={{
                                                marginLeft: 8
                                            }}
                                        >
                                            <ArrowButton direction="down"
                                                         border
                                                         onClick={function(){
                                                            window.g_download(window.hash_name_file_table[mess.hashKey]);
                                                         }}/>
                                        </div>
                                        </div>
                                    </Message.CustomContent>
                                </Message>)))
                            })
                        }
                    </MessageList>
                    <MessageInput
                        for="actual-btn"
                        placeholder="Type message here"
                        attachButton={false}
                        value={messageInputValue}
                        onChange={(val) => setMessageInputValue(val)}
                        onSend={function (message) {
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
                            if (!window.g_dictMessage[conversationId]) window.g_dictMessage[conversationId] = [];
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




