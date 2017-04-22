const command = require('../../controllers/command'),
    mongo = require('../../models/mongo'),
    model = require('./models');
console.info('>>>>', model.Resource)
const commands = {
    1: {
        'help': '/resource tag,tag2,tag3 will return all resources with the given tags',

        /**
         * This command is designed to return a list of all resources that
         * match the tags that are passed in with the request.
         * If there are no matches an string stating as much will be returned
         */
        'command': async function(tags, request, response){
            console.log('tags', tags)            
        }
    },

    2: {
        'help': '/resource tag,tag2,tag3 http://www.web.com/ will add that url with those tags',

        /**
         * This command should first check to see if the link already exists.
         * If it does, it should return the previously defined entry.
         * If the link doesnt exist, it should getOrCreate the user who made
         * the request add the link resource, tie it to the user, then loop
         * over each tag getOrCreate the tag while tying it to the resource
         * It will then build the response text and send it to each datCode
         * channel that matches each tag
         */
        'command': async function(tags, link, request, response){
            console.log(tags, link)
            console.log(request.body)
            let resource = await model.Resource.findOne({'url': link});
            console.log(resource);
            if(resource){
                //write formatted resource
            }

            let user_name = request.body.user_name,
                user = await mongo.User.findOrCreate({'username': user_name}),
                tag_models = []
                tags = tags.split(',');

            tags.forEach(async function(t, i){
                let mod_tag = await model.Tag.findOrCreate({'tag': t});
                tag_models.push(mod_tag);
                console.log('TAG', mod_tag, mod_tag.__created__);
            });
            
            console.log('user', user, user.__created__) 
        }
    }
};

const help = '/resource is used to add and list resources saved in the datCode community';

command.handler.add('resource', new command.StringArgumentParser(commands), help);
