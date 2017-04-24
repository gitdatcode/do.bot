let handler = {
    'events': {},

    'add': function(event, callback, force = false){
        if(event in this.events && !force){
            //TODO: throw error that will stop node
        }

        console.info(`Loading Event: \n\t${event} loaded\n`);

        this.events[event] = callback;

        return this;
    },

    'fire': async function(event, request, response){
        if(!(event in this.events)){
            response.status(404);
            response.send('The event: {} is not registed with do.bot.');
            return;
        }
        
        console.info(`Firing Event: ${event}\n`);

        return await this.events[event](request, response);
    }
};

const controller = {
    'post': async function(request, response){
        const body = request.body;

        return await handler.fire(body.event.type, request, response);
    }
};


module.exports = {
    'controller': controller,
    'handler': handler
};
