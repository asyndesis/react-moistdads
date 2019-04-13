import userModel from '../models/user.model'
import uploadModel from '../models/upload.model'
import mongoose from 'mongoose'
import tools from '../tools/'

let thisFileName = 'services.db'
let db = {};
//Events
mongoose.connection.on('connected', function () {
  tools.burp('FgGreen','mongoose','default connection open to ' + process.env.mongoDatabaseUri, thisFileName );
});
mongoose.connection.on('error',function (err) {
  tools.burp('FgGreen','mongoose','default connection error: ' + err, thisFileName );
});
mongoose.connection.on('disconnected', function () {
  tools.burp('FgRed','mongoose','default connection disconnected', thisFileName );
});
process.on('SIGINT', function() {  
  mongoose.connection.close(function () {
    tools.burp('FgYellow','mongoose','default connection disconnected through app termination', thisFileName );
    process.exit(0);
  });
});

mongoose.model('User', userModel, 'users');
mongoose.model('Upload', uploadModel, 'uploads');

db.connect = (uri) => {
  mongoose.connect(uri,{ useNewUrlParser: true, useCreateIndex: true })
}

export default db;