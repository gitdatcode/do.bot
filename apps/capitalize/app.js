const command = require('../../controllers/command');

const help = 'Test command that turn your input into all caps.'

command.handler.add('cap', async function(request, response){
    let input = request.body.text.toUpperCase();
    response.status(200);
    response.send(input);
}, help);
