const express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    glob = require('glob'),
    path = require('path');

const app = express(),
    port = 9911;

app.use(bodyParser.json());
app.use(function(request, response, next){
    request.slack = {}; //define slack api here

    next();
});

// load all of the apps
glob.sync('./apps/*.js').forEach(function(file){
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
