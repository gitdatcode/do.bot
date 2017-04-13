let handler = {
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

const controller = {
    'post': (request, response) => {
        response.send(request.params);
    }
}

module.exports = {
    'controller': controller,
    'handler': handler
};
