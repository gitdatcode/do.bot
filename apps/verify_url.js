const event = require('../controllers/event');

event.handler.add('url_verification', function verifyUrl(request, response){
    const body = request.body;

    response.status(200);
    response.set('Content-Type', 'application/x-www-form-urlencoded');
    response.send(body.challenge);
});
