/* TODO:
 - Split socket routes and web routes from this. Make this index.
*/
import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import socketio from 'socket.io'
import cors from 'cors'
import { router } from '../routes/'
import tools from '../tools/'
import path from 'path';

let thisFileName = 'services.web'
let webEngines = {}
let webServer = express()
let httpServer = http.createServer(webServer)
let io = socketio(httpServer)

webEngines.startWebServer = (webServerPort) => { 
  webServer.use((req, res, next) => {
    bodyParser.json({
    /* Options */
    })(req, res, (err) => {
      if (err) {
        tools.burp('FgYellow','mongoose','Error with bodyParser parsing JSON.',thisFileName)
        
        next();
      }
      next();
    });
  });

  /* Uploads folder */
  //console.log(process.cwd());
  webServer.use('/public/uploads', express.static(process.cwd() + '/public/uploads'));

  webServer.use(cors())
  webServer.use('/api',router)
  /* i don't know what this does */
  /* webServer.use(function(req, res, next){ 
    res.io = io
    next()
  }) */
  webServer.listen(webServerPort,(req, cltSocket, head) => {
    tools.burp('FgGreen','webserver','default connection open to ' + webServerPort,thisFileName);
  });
}

webEngines.startSocketServer = (socketServerPort) => {
  // Socket.io Events (This can be split from this file in this syntax.)
  const sockets = (socket) => {
    socket.on('disconnect', function () {
      tools.burp('FgGreen','webserver','client connected' );
    })
  }
  tools.burp('FgGreen','socketserver','default connection open to ' + socketServerPort,thisFileName);
  io.on('connection', sockets)
}

export default webEngines
