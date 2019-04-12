import mongoose from 'mongoose';
import tools from '../tools';
import uuid from 'node-uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const User = mongoose.model('User');
let userController = {};

userController = {

  register: (req, res, next) => {
    var user = new User();
  
    user.id = uuid.v1();
    user.role = ['user'];
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    
    user.save().then((payload) => {
      tools.burp('FgCyan','webserver','A new user with email \''+payload.email+'\' has been created','controllers.user' )
      res.status('201').send(payload);
      next();
    }).catch((error) => { 
      tools.burp('FgCyan','webserver','User could not be created.','controllers.user' )
      res.status('400').send({message: 'User could not be created.'});
      next();
    });
  },

  login: (req, res, next) => {
    User.findOne({email: req.body.email}).then((payload) => {
      if(!payload) {
        tools.burp('FgCyan','webserver','Email does not exist: '+payload.email+'.','controllers.user' )
        res.status('400').send({message: 'Invalid credentials.'});
        next();
      }else{
        bcrypt.compare(req.body.password, payload.password, function(err, bres) {
          // Passwords match
          if(bres) {
            let _token = jwt.sign({userID: payload.id}, process.env.jwtSecret, {expiresIn: '2h'});
            // Update token in DB
            User.findOneAndUpdate({
              email: payload.email
            },{
              token: _token
            // Send token to client
            }).then((payload) => {
              tools.burp('FgCyan','webserver','Auth token stored and supplied to \''+payload.email+'\'','controllers.user' )
              res.send({
                email: payload.email,
                token: _token
              });
            }).catch((error) => { 
              tools.burp('FgCyan','webserver','Token could not be stored for user.','controllers.user' );
              res.status('400').send({message: 'Token could not be stored for user.'});
              next();
            });
          } else {
           // Passwords don't match
           tools.burp('FgCyan','webserver','Invalid password for email: '+payload.email+'.','controllers.user' )
           res.status('400').send({message: 'Invalid credentials.'});
          } 
        });
        
      }
    }).catch((error) => { 
      tools.burp('FgCyan','webserver','Email not found.','controllers.user' )
      res.status('400').send({message: 'Invalid credentials.'});
      next();
    });
  },

  getCurrentUser: (req, res, next) => {
    User.findOne({token: req.token, id: req.userID}).then((payload) => {
      var user = new User();
      user.username = payload.username;
      user.email = payload.email;
      user.birthday = payload.birthday;
      tools.burp('FgCyan','webserver',user.username+' is viewing profile.','controllers.user' )
      res.status('201').send(user);
    }).catch((error) => { 
      tools.burp('FgCyan','webserver','Token not found.','controllers.user' )
      res.status('400').send({message: 'Could not get user data.'});
    });
  },

  updateCurrentUser: (req, res, next) => {
    
    User.findOneAndUpdate({token: req.token, id: req.userID},{
      username: req.body.username,
      birthday: req.body.birthday
    }).then((payload) => {

      var user = new User();
      user.email = payload.email;
      user.username = payload.username;
      user.birthday = payload.birthday;

      tools.burp('FgCyan','webserver',req.body.username+' updated their profile.','controllers.user' )
      res.status('201').send(user);
    }).catch((error) => { 
      tools.burp('FgCyan','webserver','Token not found.','controllers.user' )
      res.status('400').send({message: 'Could not get user data.'});
    });
  },

}


export {userController}