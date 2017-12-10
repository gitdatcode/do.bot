/*
  app.js
  the entry point for the do.bot node app.
*/

require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    request_module = require('request'),
    utils = require('./utils'),
    glob = require('glob'),
    path = require('path'),
    slack = require('./models/slack').slack_client;

const app = express(),
    port = process.env.port || 9911;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


/**
 * add some common utilities to the request object
 */
app.use(function(request, response, next){
    request.slack = slack;
    request.external = request_module;
    request.messageChannel = utils.messageChannel;
    request.messageUser = utils.messageUser;
    //add this field to the response header so we can handle requests from the site
    response.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': ['POST', 'GET'],
        'Access-Control-Allow-Headers': '*'
    });
    next();
});


/**
 * verify every reqeust aginst the token sent from the slack server
 */
app.use(function(request, response, next){
    let token = process.env.SLACK_VERIFICATION_TOKEN,
        request_token = request.body.token;

    if('payload' in request.body){
        let payload = JSON.parse(request.body.payload);
        request_token = payload.token;
    }

    if(!token || token != request_token){
        console.error(`Verification tokens do not match`);
        return response.send(400);
    }

    next();
});

// load all of the apps
glob.sync('./apps/*/app.js').forEach(function(file){
    console.info(`Loading app: ${file}`);
    require(path.resolve(file));
});

app.get('/', function(req, res){
    res.send('do.bot');
});

app.listen(port, function(){
    console.log('do.bot is running on port ' + port);
});

require('./routes')(app);
