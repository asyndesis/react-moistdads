import mongoose from 'mongoose';
import tools from '../tools';
import uuid from 'node-uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import gm from 'gm';
import ffmpeg from 'fluent-ffmpeg';


const Upload = mongoose.model('Upload');


//this shells out a thumbnail for what was uploaded
const _saveThumbnail = (file) => { // edited arg
  let mime = file.mimetype.split('/');
      mime = mime[0];
  let n, thumbPath;

  switch (mime){
    case 'image' :
      n = file.path.lastIndexOf(".");
      thumbPath = file.path.substring(0,n)+"_thumb"+file.path.substring(n);
      return new Promise((resolve, reject) => {
        gm(file.path).thumb(150, 150, `${thumbPath}`, 100, (err) => { // edited
          if (err) reject(new Error(err));
          resolve(thumbPath);
        });
      });
      break;
    case 'video' :
      n = file.filename.lastIndexOf(".");
      thumbPath = file.filename.substring(0,n)+"_thumb"+'_v'+'.png'
      return new Promise((resolve, reject) => {
        ffmpeg(file.path)
        .withVideoCodec('libx264')
        .on('filenames', function(filenames) {
          tools.burp('FgCyan','webserver','Will generate ' + filenames.join(', '),'controllers.public' )
        })
        .on('end', function() {
          tools.burp('FgCyan','webserver','Video creenshots taken','controllers.public' )
          resolve(process.env.uploadDirectory+'/'+thumbPath);
        })
        .on('error',function(err){
          tools.burp('FgRed','webserver',err,'controllers.public' )
        })
        .screenshots({
          //timestamps: ['20%', '40%', '60%'],
          count:1,
          filename: thumbPath,
          folder: process.env.uploadDirectory,
        }).outputOptions(['-vframes 1', '-vcodec png', '-f rawvideo', '-s 320x240', '-ss 00:00:01'])

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
    _saveThumbnail(file).then((thumbPath) => {
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