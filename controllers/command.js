const handler = {
    'commands': {},

    'add': function(command, callback, force = false){
        if(command in this.commands && !force){
            //TODO: throw error that will stop node
        }

        this.commands[command] = callback;

        return this;
    },

    'fire': function(command, request, response){
        if(!(command in this.commands)){
              response.status(404);
              response.send('The command: {} is not registed with do.bot.');
        }

        return this.commands[command](request, response);
    }
};

/**
 * Simple argument parser for commands. It will accept commands bound to
 * strings and commands that will be executed based on the number of arguments. 
 * This is done when none of the string commands can be matched and it finds 
 *
 * example slack ussage:
 *      /somecommand $argument $input
 *
 * usage:
 *      var commands = {
 *          'help': function(input, request, response){},
 *          'list': function(input, request, response){},
 *          1: function(input, request, response*{},
 *          2: function(input_one, input_two, request, response){}
 *      };
 *
 *      var some_command = new StringArgumentParser(commands);
 *      command.handler.add('somecommand', some_command);
 *
 * @param commands ObjectLiteral<String|Int:Function>
 * @return function(request, response){}
 */
function StringArgumentParser(commands){
    var num_commands = {},
        final_commands = {};

    for(var command in commands){
        if(commands.hasOwnProperty(command)){
            if(typeof command === 'number'){
                num_commands[command] = commands[command];
            }else{
                final_commands[command] = commands[command];
            }
        }
    }

    var num_parser = new NumberArgumentParser(num_commands);

    return function(request, response){
        const parts = request.body.text.split(' '),
            command = parts.shift(),
            input = parts.join(' ');

        if(command in final_commands){
            return final_commands[command](input, request, response);
        }else{
            try{
                return num_parser(request, response);
            }catch{
                //TODO: return 400-level error command not found
            }
        }
    };
};


/**
 * 
 */
function NumberArgumentParser(commands){
    return function(request, response){
        const parts = request.body.text.split(' '),
            num = parts.length;

        if(num in commands){
            const args = parts.slice(0, num),
                remainder = parts.slice(num).join(' ');

            args.concat(remainder);

            return commands[num].call(undefined, args);
        }else{
            
        }
    };
};

const controller = {
    'post': (request, response) => {
        response.send(request.params);
    }
}

module.exports = {
    'controller': controller,
    'handler': handler,
    'StringArgumentParser': StringArgumentParser,
    'NumberArgumentParser': NumberArgumentParser
};
