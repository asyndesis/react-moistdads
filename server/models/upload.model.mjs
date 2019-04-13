import mongoose from 'mongoose'
import tools from '../tools'

let uploadModel = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  files: {
    type: Array 
  },
  date: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now
  }
});

/* Middleware */
uploadModel.pre('save',function(next) {
  next();
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
