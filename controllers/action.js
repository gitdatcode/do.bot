const command = require('.command');

const handler = {
    'actions': {},

    'add': function(action, callback, help, force = false){
        if(action in this.actions && !force){
            //TODO: throw error that will stop node
        }

        this.actions[action] = {
            'callback': callback,
            'help': help
        };

        console.info(`\tAction: ${action} (${help}) has been loaded\n`);

        return this;
    },

    'fire': async function(action, request, response){
        if(!(action in this.actions)){
              response.status(404);
              response.send('The action: {} is not registed with do.bot.');
        }

        console.info(`\tRunning action: ${action}\n`);

        return await this.actions[action]['callback'](request, response);
    }
};


const controller = {
    'post': async function(request, response){
        const action = request.params.action;

        await handler.fire(action, request, response);
    }
};

module.exports = {
    'controller': controller,
    'handler': handler,
    'StringArgumentParser': command.StringArgumentParser,
    'NumberArgumentParser': command.NumberArgumentParser
};
