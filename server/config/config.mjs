export default {
  development: {
    auth: false, //disable token in routes/middleware
    jwtSecret: 'arfarfarfarf123123farts',
    webServerPort : 4100,
    mongoDatabaseUri : "mongodb://localhost:27017/moistdads",
    socketPort: 'o_o?', /* update socket server file when you find out how to pass a socket */
    uploadDirectory: './public/uploads',
    scratchDirectory: './public/scratch',
    maxUploadSize: 20963164
  },
  production : {
    auth: false,
    jwtSecret: 'arfarfarfarf123123farts',
    webServerPort : 4100,
    mongoDatabaseUri : "mongodb://xxxxx/moistdads",
    socketPort: 'o_o',
    uploadDirectory: './public/uploads',
    scratchDirectory: './public/scratch',
    maxUploadSize: 20963164
  }
}   