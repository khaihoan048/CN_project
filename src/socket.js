import { io } from "socket.io-client";

const socket = io.connect('http://103.195.236.149:6969', {autoConnect: false});

console.log(socket);
socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
