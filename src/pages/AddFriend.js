import "./chatStyle.css";
import React, {useState, useEffect} from 'react'
import {
    AddUserButton
} from "@chatscope/chat-ui-kit-react";

const AddFriend = ({socket}) => {
    const [friend, setFriend] = useState([]);

    const addFriend = (e) => {
        e.preventDefault();
        try{
            // socket.emit('add', friend);
            console.log(`You and ${friend} are friends now`);
        }
        catch{
            console.log(`${friend} is not exist`);
        }
    }


    return (
        <form className="add-friend" onSubmit={addFriend}>
            <input type="text" 
            minLength={6} 
            name="friend-name" 
            id='friend-name'
            placeholder="Enter the name..."
            className='input-friend-name'
            value={friend} 
            onChange={e => setFriend(e.target.value)}
            />
            <AddUserButton/>
        </form>
    )
}

export default AddFriend;