const command = require('../../controllers/command'),
    google = require('google');

const help = 'Get an answer to your question',
    command_name = 'lookup';


command.handler.add(command_name, async function(request, response){
    let search = request.body.text;

    google(search, function(err, res){
        if(err){
            var message = 'There was an error with your search'

            response.send(message);
        }else{
            var result = res.links[0],
                description = result.description,
                link = result.href,
                title = result.title,
                user = request.body.user_name,
                message = `User @${user} looked up _'${search}'_ \n*${title}*\n${description}\n ${link}`,
                channel = '#lookups';

            try{
                request.slack.chat.postMessage(channel, message, function(err, r){
                    response.send(message) 
                    response.status(200);
                });
            }catch(e){
                response.send(message);
                response.status(200);
            }
        }
    });
}, help);
