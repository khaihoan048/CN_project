const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 6969
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const {createPool} = require('mysql');

const { connect } = require("http2");
const { exit } = require("process");
// db.connectDB();

app.use(cors())
let users = []

const db = createPool({
  host: 'localhost',
  user: 'root',
  database: 'chatapp',
  password: 'asdf',
  connectionLimit: 10
});



// socketIO.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`)  
//     socket.on("message", data => {
//       socketIO.emit("messageResponse", data)
//     })

//     socket.on("typing", data => (
//       socket.broadcast.emit("typingResponse", data)
//     ))

//     socket.on("newUser", data => {
//       users.push(data)
//       socketIO.emit("newUserResponse", users)
//     })
 
//     socket.on('disconnect', () => {
//       console.log('🔥: A user disconnected');
//       users = users.filter(user => user.socketID !== socket.id)
//       socketIO.emit("newUserResponse", users)
//       socket.disconnect()
//     });
// });

// app.get("/api", (req, res) => {
//   res.json({message: "Hello"})
// });


// db.connectDB()
// .then((connection) =>{
//   connection.query(`SELECT * FROM user`, (err, res) => {
//     console.log(res);
//     db.closeDB(connection);
//     return;
//   })
// })


var name = 'shuti';
var tmpName = db.query(`SELECT username FROM user WHERE username = 'shuti'`, (err, res) => {
  console.log(res);
  db.end();
  return res; 
})

console.log(tmpName)
  // if (tmpName != undefined) {
  //   // socket.emit('un-sign-up');
  //   console.log(tmpName);
  //   console.log('User existed');
  //   db.closeDB(connection);
  // }
  // else {
  //   connection.query(
  //     `INSERT INTO user (username, password) VALUES('${username}', '${encryptPassword}');`,
  //     function (err, data, fields){
  //       db.closeDB(connection);
  //       // socket.emit('signuped');
  //       console.log('sign up successfully');
  //     }
  //   )
  // }
// })

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});