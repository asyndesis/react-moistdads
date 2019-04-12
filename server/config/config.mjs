export default {
  development: {
    auth: false, //disable token in routes/middleware
    jwtSecret: 'arfarfarfarf123123farts',
    webServerPort : 4100,
    mongoDatabaseUri : "mongodb://localhost:27017/stephsy",
    socketPort: 'o_o?', /* update socket server file when you find out how to pass a socket */
    uploadDirectory: './uploads'
  },
  production : {
    auth: false,
    jwtSecret: 'arfarfarfarf123123farts',
    webServerPort : 80,
    mongoDatabaseUri : "mongodb://xxxxx/stephsy",
    socketPort: 'o_o',
    uploadDirectory: './uploads'
  }
}   