const command = require('../../controllers/command');

const help = 'do.bot help application';

const commands = {
    /**
     * /dobot help
     */
    'help': function(input, request, response){
        let all_commands = [];

        all_commands.push('List of all active do.bot commands:');

        for(var c in command.handler.commands){
            if(command.handler.commands.hasOwnProperty(c)){
                const help = command.handler.commands[c]['help'];

                all_commands.push(`/${c}:\n\t\t${help}`);
            }
        }

        response.status(200);
        response.send(all_commands.join('\n\n'));
    }
};

const command_parser = new command.StringArgumentParser(commands);

command.handler.add('dobot', command_parser, help);

