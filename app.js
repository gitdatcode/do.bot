const express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    glob = require('glob'),
    path = require('path'),
    WebClient = require('@slack/client').WebClient,
    slack_api_token = process.env.SLACK_API_TOKEN,
    slack_web_client = new WebClient(slack_api_token);

const app = express(),
    port = 9911;

app.use(bodyParser.json());
app.use(function(request, response, next){
    request.slack = slack_web_client;

    next();
});

// load all of the apps
glob.sync('./apps/*/app.js').forEach(function(file){
    console.info('Loading app: ' + file);
    require(path.resolve(file));
});

app.get('/', function(req, res){
    res.send('do.bot');
});

app.listen(port, function(){
    console.log('do.bot is running on port ' + port);
});

require('./routes')(app);
