const command = require('./controllers/command'),
    event = require('./controllers/event'),
    action = require('./controllers/action');


module.exports = function(app){
    app.post('/command/:command', command.controller.post);

    app.post('/event', event.controller.post);

    app.post('/action', action.controller.post);
};
