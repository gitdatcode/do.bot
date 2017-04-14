/* buffit.js
  this is a slash command to add resource posts to a Buffer account, which shares to
  the DatCode Twitter account
  author: Jer'Maine Jones, Jr. @jermaine
*/
let run = require('./app').run;
const buffit = {
  //send function | used when another app wants to post to the Buffer account
  send: (text, user, channels) => {
    if (text === "" || user === "" || channels.length === 0)
    {
      console.log('(buffit/index.js : buffit.send) Something wrong with args. ')
    }
    else{
      run(text, user, channels);
    }
  }
};

//export the buffit object as a module
module.exports = buffit;
