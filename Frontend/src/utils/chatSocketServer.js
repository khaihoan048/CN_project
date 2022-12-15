// import * as io from 'socket.io-client';
const io = require('socket.io-client');
const events = require('events');


class ChatSocketServer {
    
    eventEmitter = new events.EventEmitter();

    // Connecting to Socket Server
    establishSocketConnection(userId) {
        console.log(`userId: ${userId}`);
        try {
            this.socket = io.connect("http://localhost:4000", {query: `userId=${userId}`});
            console.log('connect to socket server')
        } catch (error) {
            console.log(error);
            alert(`Something went wrong; Can't connect to socket server`);
        }
    }

    getChatList(userId) {
        this.socket.emit('chat-list', {
            userId: userId
        });
        this.socket.on('chat-list-response', (data) => {
            this.eventEmitter.emit('chat-list-response', data);
        });
    }

    sendMessage(message) {
        this.socket.emit('add-message', message);
    }

    receiveMessage() {
        this.socket.on('add-message-response', (data) => {
            this.eventEmitter.emit('add-message-response', data);
        });
    }

    logout(userId) {
        this.socket.emit('logout', userId);
        this.socket.on('logout-response', (data) => {
            this.eventEmitter.emit('logout-response', data);
        });
    }

    search(username){
        this.socket.emit('search', username);
        this.socket.on('search-response', (data) => {
            this.eventEmitter.emit('search-response', data);
        })
    }

}

export default new ChatSocketServer()