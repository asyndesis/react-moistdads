import express from 'express'
import {userController} from '../controllers/user.controller'
import {publicController} from '../controllers/public.controller'
import jwt from 'jsonwebtoken'
import tools from '../tools/'
import multer from 'multer'



const router = express.Router();

/* Hacky CB For Multer */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, process.env.uploadDirectory)
  },
  filename: function (req, file, cb) {
    /* ToDo: This needs code to parse the mimetype and just append .ext to file before saving */
    cb(null, tools.generateUID() +'.'+ file.originalname.split('.').pop());        
  }
})
const upload = multer({ storage: storage }).single('filepond');


const tokenAuth = (req, res, next) => {
  /* Non-protected routes. This is hacky. I know */
  if (req.originalUrl == '/api/register' || req.originalUrl == '/api/login'){
    return next();
  }
  // check header or url parameters or post parameters for token
  req.token = tools.revealToken(req);
  // decode token
  if (req.token) {
    // verifies secret and checks exp
    jwt.verify(req.token, process.env.jwtSecret, function(err, decoded) {
      if (err) {
        tools.burp('FgCyan','webserver','User has invalid token.','routes' )
        return res.status(403).send({ 
          message: 'Invalid token.' 
        });
      } else {
        // if everything is good, save to request for use in other routes
        //req.decoded = decoded; //this contains some extra info that i might need later for security?
        req.userID = decoded.userID;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    tools.burp('FgCyan','webserver','User did not provide token.','routes' )
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
}

/* Middleware */
if (process.env.auth === true){
  router.use(tokenAuth);
}

/* Routes */
router.post('/login',userController.login)
router.post('/register',userController.register)
router.get('/getCurrentUser',userController.getCurrentUser)
router.post('/updateCurrentUser',userController.updateCurrentUser)

/* Moist Routes */
router.post('/upload',upload,publicController.upload)
router.get('/getMoistDadOfDay',publicController.getMoistDadOfDay)
router.get('/getLatestDads',publicController.getLatestDads)
router.get('/getDadById',publicController.getDadById)
router.get('/getDadPreview.png',publicController.getDadPreview)

export {router}