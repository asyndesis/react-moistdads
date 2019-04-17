import mongoose from 'mongoose';
import tools from '../tools';
import uuid from 'node-uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import gm from 'gm';


const Upload = mongoose.model('Upload');


//this shells out a thumbnail for what was uploaded
const _saveThumbnail = (file) => { // edited arg
  let mime = file.mimetype.split('/');
      mime = mime[0];
  console.log(mime);
  switch (mime){
    case 'image' :
      return new Promise((resolve, reject) => {
        var n=file.path.lastIndexOf(".");
        var thumbPath = file.path.substring(0,n)+"_thumb"+file.path.substring(n);
        gm(file.path).thumb(150, 150, `${thumbPath}`, 100, (err) => { // edited
          if (err) reject(new Error(err));
          resolve();
        });
      });
      break;
    case 'video' :
      return new Promise((resolve, reject) => {
        reject(new Error('farts'));
      });
      break;
    default :
      return new Promise((resolve, reject) => {
        reject(new Error('farts'));
      });
      break;
  }




};

let publicController = {

  upload: (req, res, next) => {
    let file = res.req.file;
    let upload = new Upload();
        upload.id = uuid.v1()
        upload.files = [];
    //if this error comes up, something is happing at middleware level (routes middleware)
    if (!res.req.file){   
      tools.burp('FgYellow','webserver','No file was uploaded.','controllers.public' )
      next();
    }

     // save that thumb
    _saveThumbnail(file).then(() => {
      let n=file.path.lastIndexOf(".");
      let thumbPath = file.path.substring(0,n)+"_thumb"+file.path.substring(n);
      file.thumbPath = thumbPath;
      upload.files.push(file);
      //db saving
      upload.save().then((payload) => {
        tools.burp('FgCyan','webserver','Upload with id: \''+payload.id+'\' has been created with a _thumb','controllers.public' )
        res.status('201').send(payload);
        next();
      }).catch((error) => { 
        tools.burp('FgYellow','webserver','Upload could not be saved.','controllers.public' )
        res.status('400').send({message: 'Upload could not be saved.'});
        next();
      });
    }).catch((error) => {
      tools.burp('FgYellow','webserver',error,'controllers.public' )
      res.status('400').send({message: 'Upload could not be created.'});
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
      tools.burp('FgYellow','webserver','Moist dad of day failed.','controllers.public' )
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