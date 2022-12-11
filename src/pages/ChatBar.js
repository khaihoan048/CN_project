import React, {useState, useEffect} from 'react'
import {
    Sidebar,
    StatusList,
    Status
} from "@chatscope/chat-ui-kit-react";
import AddFriend from './AddFriend.js';

const ChatBar = ({socket}) => {
    const [users, setUsers] = useState([])

    useEffect(()=> {
        socket.on("newUserResponse", data => setUsers(data))
    }, [socket, users])

    var elems = ['Shuti', 'DucTien', 'Hoan Map Djt'];

    return (
        <Sidebar position="left" scrollable={false}>
          <AddFriend socket={socket}/>
          <h2>Online Friends</h2>
          <StatusList>
            {elems.map(elem => <Status size="lg" status="available" >{elem}</Status>)}
          </StatusList>
        </Sidebar>

    )
}

export default ChatBar;