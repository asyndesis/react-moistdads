import mongoose from 'mongoose';
import tools from '../tools';
import uuid from 'node-uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import moment from 'moment';

const Upload = mongoose.model('Upload');
let publicController = {};

publicController = {

  upload: (req, res, next) => {
    let files = [];
    let upload = new Upload();
        upload.id = uuid.v1()
        upload.files = [];
    //if this error comes up, something is happing at middleware level (routes middleware)
    if (!res.req.files){   
      tools.burp('FgYellow','webserver','No file was uploaded.','controllers.public' )
      next();
    }

    files = res.req.files;
    //loop through files in the formdata
    files.forEach(function (f) {
      //prep that upload entry for the database
      upload.files.push(f);
      if (f.filename){
        tools.burp('FgCyan','webserver','\''+f.filename+'\' uploaded to server.','controllers.public' )
      }
    });

    //db saving
    upload.save().then((payload) => {
      tools.burp('FgCyan','webserver','Upload with id: \''+payload.id+'\' has been created','controllers.public' )
      res.status('201').send(payload);
      next();
    }).catch((error) => { 
      tools.burp('FgCyan','webserver','Upload could not be created.','controllers.public' )
      res.status('400').send({message: 'Upload could not be created.'});
      next();
    });

  },
  getMoistDadOfDay: (req, res, next) => {
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    Upload.find({
      date: {
        $gte: moment(yesterday).startOf('day').toDate(),
        $lte: moment(today).endOf('day').toDate()
      }
    }).then((payload) => {
      tools.burp('FgCyan','webserver','Moist dad of day requested.','controllers.public' )
      res.status('201').send(payload);
      next();
    }).catch((error) => { 
      tools.burp('FgCyan','webserver','Moist dad of day failed.','controllers.public' )
      res.status('400').send({message: 'Moist dad could not be found.'});
      next();
    });
  },

  getLatestDads: (req, res, next) => {
    Upload.find({
    }).sort('-date').limit(10).then((payload) => {
      tools.burp('FgCyan','webserver','Latest dads requested.','controllers.public' )
      res.status('201').send(payload);
      next();
    }).catch((error) => { 
      tools.burp('FgCyan','webserver','Latest dads failed.','controllers.public' )
      res.status('400').send({message: 'Latest dads could not be found.'});
      next();
    });
  }


}


export {publicController}