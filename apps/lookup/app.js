const command = require('../../controllers/command'),
    google = require('google');

const help = 'Get an answer to your question',
    command_name = 'lookup';


command.handler.add(command_name, async function(request, response){
    let search = request.body.text;

    google(search, function(err, res){
        if(err || !res.length){
            let message = 'There was an error with your search'
        }else{
            let result = res[0],
                description = result.description,
                link = result.href,
                title = result.title,
                message = `The internet says ${search} means:\n
                    *${title}*\n
                    ${description}\n
                    _${link}_`;
        }

        response.status(200);
        response.send(message);
    });
}, help);
