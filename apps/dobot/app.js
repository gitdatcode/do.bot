const command = require('../../controllers/command');

const help = 'do.bot help application';

command.handler.add('dobot', function(request, response){
    /**
     * this is defined on demand becuase there is no guarentee that this app
     * will load after the others
     */
    let all_commands = [];

    Object.each(command.handler.commands, function(c){
        const help = command.handler.commands[c]['help'];

        all_commands.push(`${c}: ${help}`);
    });

    response.status(200);
    response.send(all_commands.join('\n'));
}, help);
