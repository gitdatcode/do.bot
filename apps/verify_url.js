const event = require('../controllers/event');

event.handler.add('verify_url', function verifyUrl(request, response){
    const body = request.body;

    response.status(200);
    response.set('Content-Type', 'application/x-www-form-urlencoded');
    response.send(body.challenge);
});
