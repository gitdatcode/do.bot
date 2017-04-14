/* app.js
  this file holds all the functions for the buffit command
  author: Jer'Maine Jones, Jr. @jermaine
*/

//wrapping everything in an object so that it's exportable
module.exports = {
  //insert your Buffer client ID, or add in env file
  const BUFFER_CLIENT_ID = process.env.BUFFER_CLIENT_ID || 'xxxxxxxxxxx';
  //insert your Buffer client secret, or add in env file
  const BUFFER_CLIENT_SECRET = process.env.BUFFER_CLIENT_SECRET || 'xxxxxxxxxxx';
  //inser your Buffer access token, or add in env file
  const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN || "xxxxxxxxxxx";
  //object of service:username array pairs, for use in the Buffer request
  const PROFILE_IDS =
  {
    'twitter': ['talkdatcode']
  };

  /*
    getBufferProfileIDs function | sends a GET request to Buffer, returning an array of the user's profiles.
    returns the completed array
  */
  const getBufferProfileIDs = () => {
    let ids = [];
    let url = 'https://api.bufferapp.com/1/profiles.json?access_token=' + BUFFER_ACCESS_TOKEN;
    //send the request to Buffer
    request.external.get(url, (err, res, body) => {
      if(err)
      {
        console.log('(buffit.js : getBufferProfileIDs:request.external.get) There was an error. ', err);
      }
      else if (res.statusCode !== 200){
        console.log('(buffit.js : getBufferProfileIDs:request.external.get) Something happened.\n %s', body );
      }
      else{
        let resData = JSON.parse(body);
        //loop through the JSON to get the profile ids
        for( let i = 0; i < resData.length; i++)
        {
          for( let service in PROFILE_IDS )
          {
            for( let j = 0; j < PROFILE_IDS[service].length; j++ )
            {
              if(resData[i].service === service )
              {
                if( resData[i].service_username === PROFILE_IDS[service][j] ) { ids.push(resData[i].id); }
                console.log(ids);
              }
            }
          }
        }
      }
      return ids;
    });
  };

  /*
    buildBufferRequest function | builds the paylod for the Buffer request.
    returns the completed array
  */
  const buildBufferRequest = (text, ids, callback) => {
      let data = {
        text: text,
        shorten: true,
        now: false,
        top: false,
        access_token: BUFFER_ACCESS_TOKEN,
        profile_ids: ids
      }
      callback(data);
  };

  /*
    getBufferProfileIDs function | sends a GET request to Buffer, returning an array of the user's profiles.
    returns the completed array
  */
  const sendBufferRequest = (data) => {
    request.external.post({ url:"https://api.bufferapp.com/1/updates/create.json", form: data }, (err, res, body) => {
        if (err){ //if it's an error
          console.log("(buffit.js : sendBufferRequest:request.external.post) Error: ", err);
          return false;
        }
        else if(res.statusCode != 200){
          console.log('(buffit.js : sendBufferRequest:request.external.post) Something happened. ', res);
          return false;
        }
        else{ //log the successful Buffer request
          console.log('(buffit.js : sendBufferRequest:request.external.post) Upload to Buffer successful.');
          return true;
        }
      };
  };

  /*
    sendSlackResponse function | a second response sent back to the user confirming it was added to Buffer,
    and a post to the channel with the content attached
    text - content sent to buffit
    user - id of user who fired the command
    channel - where the command came from
    responseUrl -
  */
  const sendSlackResponse = (text, user, channel) => {
    //send the user a DM letting them know the post to Buffer was successful
    request.slack.chat.postMessage(user, "Your post was added to Buffer. Thanks for sharing :smile:", (err, response) => {
      if (err){
        console.log("(buffit.js : sendSlackResponse:request.slack.chat.postMessage) Error: ", err);
      }
      else{
        console.log("(buffit.js : sendSlackResponse:request.slack.chat.postMessage) DM message sent: ", response);
      }
    });
    //post a message back to the channel it was sent from with the content
    request.slack.chat.postMessage(channel, )
  };

  /*
    run function | THE MAIN FUNCTION. Called when /buffit command has been fired.
    request - the request sent from Slack
    response - what we send back to Slack to confirm we received it
    channels (optional) - if you want to use buffit in other modules, and you have more than one channel to post to,
    include a channels array in your function call
  */
  const run = (text, user, channels) => {
    //get the Buffer ids and build the payload for the request
    buildBufferRequest(text, getBufferProfileIDs(), (data) => {
      if(data.text === "" || data.profile_ids.length === 0)
      {
        console.log("(buffit.js buffit:buildBufferRequest) something wrong with the data. ", data);
      }
      else{
        //send the request
        if( sendBufferRequest(data) ) { sendSlackReponse(text, user, channels) };
      }
    });
  };
};
