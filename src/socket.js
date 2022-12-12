import { io } from "socket.io-client";

const socket = io.connect('http://103.195.236.149:5555', {autoConnect: false});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
