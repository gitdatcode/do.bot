/*
signup/app.js
*/

const event = require("../../controllers/event");

/*
sendToSlack function | sends the signup info to the Slack channel
request - the request sent from the site
response - sent back to the site after receipt of the request
*/
const sendToSlack = (request, response) => {
        //send a 200 response back
	response.append('Access-Control-Allow-Origin', 'http://www.datcode.io/');
        response.status(200).send();
	    console.log("signup/app.js | sendToSlack: 200 response sent");
        console.log("REQUEST BODY", request.body)
        
        //get the name and email from the request body
        let name = request.body.event.first_name + " " + request.body.event.last_name,
            email = request.body.event.email,
	        social = request.body.event.social,
            how = request.body.event.how,
            message = `*new signup*:\n${name}\n${email}\n${social}\nvia: ${how}`;
        //build the message
        //message = message.replace(/@name/i, name);
        //message = message.replace(/@email/i, email);
        console.info('SENDING NEW SIGNUP MESSAGE: ' + message)
        //send message to Slack
        request.slack.chat.postMessage("signups", message, {'parse': 'full'}, (err, response) => {
		if (err){
      		console.log("(signup/app.js : sendToSlack:request.slack.chat.postMessage) Error: ", err);
    		}
    		else{
      		console.log("(signup/app.js : sendToSlack:request.slack.chat.postMessage) Message sent: ", response);
   		 }	
});
};

//add event to event handler
event.handler.add("signup", sendToSlack);

