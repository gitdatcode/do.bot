const command = require('../../controllers/command');

const help = 'do.bot help application';

command.handler.add('dobot', function(request, response){
    /**
     * this is defined on demand becuase there is no guarentee that this app
     * will load after the others
     */
    let all_commands = [];

    for(var c in command.handler.commands){
        if(command.handler.commands.hasOwnProperty(c)){
            const help = command.handler.commands[c]['help'];

            all_commands.push(`${c}: ${help}`);
        }
    }

    response.status(200);
    response.send(all_commands.join('\n'));
}, help);
