const handler = {
    'commands': {},

    'add': function(command, callback, help, force = false){
        if(command in this.commands && !force){
            //TODO: throw error that will stop node
        }

        this.commands[command] = {
            'callback': callback,
            'help': help
        };

        return this;
    },

    'fire': function(command, request, response){
        if(!(command in this.commands)){
              response.status(404);
              response.send('The command: {} is not registed with do.bot.');
        }

        return this.commands[command]['callback'](request, response);
    }
};

/**
 * Simple argument parser for commands. It will accept commands bound to
 * strings and commands that will be executed based on the number of arguments.
 * This is done when none of the string commands can be matched and it
 * determines the closest number of arguments that are less than or equal to
 * what has been defined.
 *
 * example slack ussage:
 *      /somecommand $argument $input
 *
 * developer usage:
 *      var commands = {
 *          'help': function(input, request, response){},
 *          'list': function(input, request, response){},
 *          1: function(input, request, response){},
 *          2: function(input_one, input_two, request, response){}
 *      };
 *
 *      var some_command = new StringArgumentParser(commands);
 *      command.handler.add('somecommand', some_command);
 *
 * @see NumberArgumentParser
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
 * A way to define commands based on the number of space-separated arguments
 * that are passed into it. If the exact number isn't matched, it will
 * execute the next lowest number in the command stack.
 *
 * example slack ussage:
 *      /somecommand $argument $input
 *
 * developer usage:
 *      var commands = {
 *          1: function(input, request, response){},
 *          2: function(input_one, input_two, request, response){}
 *      };
 *
 *      var some_command = new NumberArgumentParser(commands);
 *      command.handler.add('somecommand', some_command);
 *
 * from slack:
 *      /somecommand one two three four
 *
 * result:
 *      based on the commands defined above, 2 would be matched. input_one
 *      would be set to 'one' while input_two would be 'two three four'
 *
 * @TODO make this work
 * @param commands ObjectLiteral<Int:Function>
 * @return function(request, response){}
 */
function NumberArgumentParser(commands){
    commands = commands || {}

    return function(request, response){
        const parts = request.body.text.split(' '),
            command = parts.length,
            nums_registered = Object.keys(commands).reverse();

        nums_registered.forEach(function(num){
            if(command === num){
                var args = parts.slice(0, num),
                    remainder = parts.slice(num).join(' ');

                args.concat(remainder);

                return commands[num].call(undefined, args)
            }
        });
    };
};


const controller = {
    'post': function(request, response){
        handler.fire(request.params.comamnd, request, response);
    }
};

module.exports = {
    'controller': controller,
    'handler': handler,
    'StringArgumentParser': StringArgumentParser,
    'NumberArgumentParser': NumberArgumentParser
};
