import colors from './colors'
import path from 'path'

let tools = {}

tools.burp = (color,title,message,file) => {
  var date = new Date();
  var timeString = date.toISOString().substr(11, 8);
  if (file){
    file = ' -> '+file+' -> '
  }else{
    file = ' ';
  }
  console.log(timeString+' ['+colors[color]+title+colors['Reset']+']'+file+message)
}

tools.isJson = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

tools.revealToken = (req) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (req.headers.authorization){
    if (req.headers.authorization.startsWith("Bearer ")){
      token = req.headers.authorization.substring(7, req.headers.authorization.length);
    }
  }
  return token;
}

tools.generateUID = () => {
  function d4() {
      var d = new Date();
      var t = d.getTime();
      return t;
  }

  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + d4();
}

export default tools

