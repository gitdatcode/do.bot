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
app.use(function(request, response, next){
    request.slack = slack;
    request.external = request_module;
    request.messageChannel = utils.messageChannel;
    request.messageUser = utils.messageUser;

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
