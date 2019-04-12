import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import tools from '../tools'

let uploadModel = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  
});

/* Middleware */
uploadModel.pre('save',function(next) {

});
uploadModel.post('save', function(err, payload, next) {
  if (err){
    switch (err.code){
      case 11000:
        tools.burp('FgCyan','mongoose','Duplicate key exists for upload','models.upload')
        break;
      default:
        tools.burp('FgCyan','mongoose','Error creating new upload','models.upload')
        break;
    }
  }
  next();
});
uploadModel.post('validate', function(err, payload, next) {
  if (err){
    tools.burp('FgCyan','mongoose','Error validating new upload','models.upload')
  }
  next();
});

export default uploadModel
