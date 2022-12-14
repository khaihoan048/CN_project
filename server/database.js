const mysql = require('mysql');
require('dotenv').config();
const {createPool} = require('mysql');

// module.exports.connectDB = () =>{
//     return new Promise((resolve, reject) => {
//         const conn = mysql.createConnection({
//             host: process.env.DB_HOST || 'localhost',
//             user: process.env.DB_USER || 'root',
//             password: process.env.DB_PASS || 'asdf',
//             database: process.env.DB_NAME || 'chatapp',
//             port: process.env.DB_PORT || '3306'
//         });
//         conn.connect((err) => {
//             if (err)
//                 reject(err);
//             resolve(conn);
//         });
//     });
// }

// module.exports.closeDB = (conn) => {
//     console.log('close db');
//     conn.destroy(); 
// }

const pool = createPool({
    host: 'localhost',
    user: 'root',
    database: 'chatapp',
    password: 'asdf',
    connectionLimit: 10
});

pool.query(`SELECT username FROM user WHERE username = 'shuti'`, (err, res) => {
    console.log(res);
})
