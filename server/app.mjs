import config from './config'
import database from './services/db'
import webEngines from './services/web'

// Create the database connection
database.connect(process.env.mongoDatabaseUri)
// Start the webserver

// Host the socket server
webEngines.startWebServer(process.env.webServerPort)
webEngines.startSocketServer(process.env.webServerPort)

