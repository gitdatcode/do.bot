const command = require('../../controllers/command');

const help = 'Test command that turn your input into all caps.'

command.handler.add('cap', function(input, request, response){
    input = input.toUpperCase();
    response.status(200);
    response.send(input);
}, help);
