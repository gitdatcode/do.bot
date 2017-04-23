/*  welcome.js
  this is an onboarding app, which basically means it greets new users with a quick rundown on how the Slack works
  and a nice little greeting in #general so people can show love.
  author: Jer'Maine Jones, Jr. @jermaine
*/
const event = require('../../controllers/event');

const dmGreeting = "Welcome to the DatCode Slack group, we're glad you're here! Since you're new, just give a little hello in the #sayhello channel. Tell us \
where you're from, maybe what you do or what you're working on, and what you look to learn or gain within the community.\n\n\
If you're new to coding, we'd highly suggest following the #for-newbies channel, where people can post coding resources, and ask for help in\
starting their coding journey. If you're seasoned, or looking to grow in a particular area, join the #for-amateurs and/or the #resources channels as \
well as the channels that interest you; all the coding channels correspond to a language (like #htmlcss or #java) or a platform (like #ios or #android). \
There's also channels like #random and #nowplaying that are outside coding, just to talk about stuff.\n\n\
If you need any help, feel free to ask in the #general channel. We'll help you out!\n\
(If you're new to slack completely, you can ask @slackbot for help; and check this out for some tips and tricks: https://www.thrillist.com/tech/nation/slack-app-hacks-shortcuts-tips-tricks )"

const generalGreeting = "!!!!!! NEW MEMBER !!!!!! Say hey to <@username>!"

/*
  welcomeMessage function | called when the event 'team_join' has been received
  request - the request sent from Slack
  response - what we send back to Slack to confirm we received it
*/
const welcomeMessage = async (request, response) => {
  const body = request.body;
  const user = '@' + body.event.user;

  // dm the new user
  request.slack.chat.postMessage(user, dmGreeting, {'parse': 'full'},  (err, response) => {
    if (err){
      console.log("(welcome.js : welcomeMessage:request.slack.chat.postMessage) Error: ", err);
    }
    else{
      console.log("(welcome.js : welcomeMessage:request.slack.chat.postMessage) DM message sent: ", response);
    }
  });

  //post the greeting to #general
  let greeting = generalGreeting.replace(/@username/i, user);

  request.slack.chat.postMessage('general', greeting, (err, response) => {
    if (err){
      console.log("(welcome.js : welcomeMessage:request.slack.chat.postMessage) Error: ", err);
    }
    else{
      console.log("(welcome.js : welcomeMessage:request.slack.chat.postMessage) Message sent: ", response);
    }
  });
};

/*
  event.handler.add function call | adds the event to the event handler, which will call the welcomeMessage
  method when the event is received.
*/
event.handler.add('team_join', welcomeMessage);
