/* buffit.js
  this is a slash command to add resource posts to a Buffer account, which shares to
  the DatCode Twitter account
  author: Jer'Maine Jones, Jr. @jermaine
*/
const command = require('../controllers/command');
const app = require('./app');
//a short description of the app to be used for the /dobot command
const help = "command to add resource posts to a Buffer account, which shares to the DatCode Twitter account."

const buffit = {
  //post function | used when a command is received (registered to the command handler)
  post: (request, response) => {
    //respond to the request. We'll do another response later
    response.status(200);
    response.send('Got it! Thanks.');

    //text for the Buffer post
    let text = request.body.text,
    //id of user who sent the request
    user = request.body.user,
    //the channel to post back to
    channels = channels.push(request.body.channel);
    app.run(text, user, channels);
  },
  //send function | used when another app wants to post to the Buffer account
  send: (text, user, channels) => {
    if (text === "" || user === "" || channels.length === 0)
    {
      console.log('(buffit/index.js : buffit.send) Something wrong with args. ')
    }
    else{
      app.run(text, user, channels);
    }
  }

};

//export the buffit object as a module
module.exports = buffit;
//add the buffit app to the command handler
command.handler.add('/buffit', buffit.post, help);
