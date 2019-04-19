import mongoose from 'mongoose';
import tools from '../tools';
import uuid from 'node-uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import gm from 'gm'; //graphicsmagick
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';


const Upload = mongoose.model('Upload');

//ToDo: These F@cKin' 'Helper functions' need a fucking home. they're clogging up my GODDAMN controller

// _saveThumbnail 
// @input file: File
// returns Promise
const _barfFileSizes = (file) => {
  let mime = file.mimetype;
  let n, thumbPath, mainPath;
  let thumbSize = 400;

  // are we dealing with an image or a video?
  switch (mime){
    case 'image/gif' :
      n = file.filename.lastIndexOf(".");
      mainPath = (process.env.uploadDirectory)+'/'+file.filename.substring(0,n)
      thumbPath = mainPath+"_thumb"+'.png'
      return new Promise((resolve, reject) => {
        // barf the big image into uploads
        gm(file.path).write(mainPath+'.gif', (err) => {
          // turn to thumbies
          if (!err)
          gm(file.path).resize(thumbSize, thumbSize).write(thumbPath, (err) => { // edited
            if (err) reject(new Error(err));
            file.path = mainPath+'.gif';
            file.thumbPath = thumbPath;
            resolve(file);
          });
        });
      });
      break;
    case 'image/png' :
    case 'image/jpeg' :
    case 'image/jpg' :
      n = file.filename.lastIndexOf(".");
      mainPath = (process.env.uploadDirectory)+'/'+file.filename.substring(0,n)
      thumbPath = mainPath+"_thumb"+'.png'
      return new Promise((resolve, reject) => {
        // barf the big image into uploads
        gm(file.path).resize(800,800).write(mainPath+'.png', (err) => {
          // turn to thumbies
          if (!err)
          gm(file.path).resize(thumbSize, thumbSize).write(thumbPath, (err) => { // edited
            if (err) reject(new Error(err));
            file.path = mainPath+'.png';
            file.thumbPath = thumbPath;
            resolve(file);
          });
        });
      });
      break;
    case 'video/mp4' : //ffmpeg swamp. this gets buggy and scary and i'm not sure why output options needs to be here.
    case 'video/quicktime' :
      n = file.filename.lastIndexOf(".");
      mainPath = (process.env.uploadDirectory)+'/'+file.filename.substring(0,n)
      thumbPath = file.filename.substring(0,n)+"_thumb"+'_v'+'.png'
      return new Promise((resolve, reject) => {
        // move and format video
        ffmpeg(file.path).withVideoCodec('libx264').format('mp4').size('?x480')
        .on('end', function(stdout, stderr) {
          // long winded thumbnails
          ffmpeg(file.path)
          .withVideoCodec('libx264')
          .on('end', function() {
            tools.burp('FgCyan','webserver','Video creenshots taken','controllers.public' )
            file.thumbPath = (process.env.uploadDirectory).substring(2)+'/'+thumbPath;
            file.path = mainPath+'.mp4';
            file.mimetype = 'video/mp4';
            resolve(file);
          })
          .on('error',function(err){
            tools.burp('FgRed','webserver',err,'controllers.public' )
          })
          .screenshots({
            //timestamps: ['20%', '40%', '60%'],
            count:1,
            filename: thumbPath,
            folder: process.env.uploadDirectory,
          }).outputOptions(['-vframes 1', '-vcodec png', '-ss 00:00:00'])
          tools.burp('FgCyan','webserver','Video moved from scratch and converted to mp4','controllers.public' )
        })
        .on('error',function(err){
          tools.burp('FgRed','webserver',err,'controllers.public' )
        })
        .save(mainPath+'.mp4');
      });
      break;
    default :
      return new Promise((resolve, reject) => {
        reject(new Error('video and image only'));
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
    if (!file){   
      tools.burp('FgYellow','webserver','No file was uploaded.','controllers.public' )
      return res.status('400').send({message: 'Upload could not be created.'});
    }
    if (file.size > 5963164){
      tools.burp('FgYellow','webserver','File was too large to be uploaded.','controllers.public' )
      return res.status('400').send({message: 'Upload could not be created.'});
    }
    // save that thumb
    _barfFileSizes(file).then((upFile) => {
      upload.files.push(upFile);
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
    Upload.findOne({
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
  },

  getDadById: (req,res,next) => {
    Upload.findOne({id: req.query.id}).then((payload) => {
      tools.burp('FgCyan','webserver','Dad with id: '+req.query.id+' supplied.','controllers.public' )
      res.status('201').send(payload);
      next();
    }).catch((error) => { 
      tools.burp('FgCyan','webserver','Latest dads failed.','controllers.public' )
      res.status('400').send({message: 'Dad with that Id could not be found.'});
      next();
    });
  },

  getDadPreview: (req,res,next) => {
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    Upload.findOne({
      date: {
        $gte: moment(yesterday).startOf('day').toDate(),
        $lte: moment(today).endOf('day').toDate()
      }
    }).then((payload) => {
      tools.burp('FgCyan','webserver','Moist preview of day requested.','controllers.public' )
      res.status('201').set({'Content-Type': 'image/png'}).sendFile(path.resolve() +'/'+ payload.files[0].thumbPath);
    }).catch((error) => { 
      tools.burp('FgYellow','webserver',error,'controllers.public' )
      res.status('400').send({message: 'Moist preview could not be found.'});
      next();
    });
  }

}


export {publicController}