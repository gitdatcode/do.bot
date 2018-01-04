const command = require('./command');

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
        if('payload' in request.body){
            let payload = JSON.parse(request.body.payload);

            if(payload.actions){
                for(let i = 0, l = payload.actions.length; i < l; i++){
                    let action = payload.actions[i],
                        parts = action.value.split(' '),
                        act = parts.shift();
                    request.payload = payload;
                    request.action = action;
                    request.action_value = parts; 

                    return await handler.fire(act, request, response);
                }
            }else if(payload.callback_id){
                let parts = payload.callback_id.split('::'),
                    act = parts.shift();
                request.payload = payload;
                request.action = act;
                request.action_value = parts;

                return await handler.fire(act, request, response);
            }
        }else{
            self.status(400);
            self.send('error with the request');
        }
    }
};

module.exports = {
    'controller': controller,
    'handler': handler,
};

