import mongoose from 'mongoose';
import tools from '../tools';
import uuid from 'node-uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const Upload = mongoose.model('Upload');
let publicController = {};

publicController = {

  upload: (req, res, next) => {
    let files = [];
    //if the files have been saved in mulcher
    if (res.req.files){
      files = res.req.files;
      files.forEach(function (f) {
        if (f.filename){
          tools.burp('FgCyan','webserver','\''+f.filename+'\' uploaded to server.','controllers.public' )
        }
      });
    }
    /* Todo: req.body needs to be a loop, because this could be an array. */

    res.status('201').send({});
  },


}


export {publicController}