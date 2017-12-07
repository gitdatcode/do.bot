const command = require('../../controllers/command'),
    google = require('google');

const help = 'Get an answer to your question',
    command_name = 'lookup';


command.handler.add(command_name, async function(request, response){
    let search = request.body.text;

    google(search, function(err, res){
        if(err){
            var message = 'There was an error with your search'
        }else{
            var result = res.links[0],
                description = result.description,
                link = result.href,
                title = result.title,
                message = `The internet says _'${search}'_ means\n*${title}*\n${description}\n_${link}_`;
        }

        response.status(200);
        response.send(message);
    });
}, help);
