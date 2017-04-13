let handler = {
    'events': {},

    'add': function(event, callback, force = false){
        if(event in this.events && !force){
            //TODO: throw error that will stop node
        }

        console.info(`Event: ${event} loaded`);

        this.events[event] = callback;

        return this;
    },

    'fire': function(event, request, response){
        if(!(event in this.events)){
            response.status(404);
            response.send('The event: {} is not registed with do.bot.');
            return;
        }

        console.info(`Firing Event: ${event}`);

        return this.events[event](request, response);
    }
};

const controller = {
    'post': function(request, response){
        const body = request.body;

        handler.fire(body.type, request, response);
    }
};


module.exports = {
    'controller': controller,
    'handler': handler
};
