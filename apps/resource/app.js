const command = require('../../controllers/command');

const commands = {
    0: function(request, response){
        
    },

    1: function(tags, request, response){
        
    },

    2: function(tags, link, request, response){
        
    }
};

const help = '';

command.handler.add('resource', new command.NumberArgumentParser(commands), help);
