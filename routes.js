const command = require('./controllers/command'),
    event = require('./controllers/event');


module.exports = function(app){
    app.post('/command/:command', command.controller.post);

    app.post('/event', event.controller.post);
};
