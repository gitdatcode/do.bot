const command = require('../../controllers/command'),
    mongo = require('../../models/mongo'),
    model = require('./models');

const commands = {
    1: {
        'help': '/resource tag,tag2,tag3\n\t\twill return all resources with the given tags',

        /**
         * This command is designed to return a list of all resources that
         * match the tags that are passed in with the request.
         * If there are no matches an string stating as much will be returned
         */
        'command': async function(tags, request, response){
            tags = tags.split(',');
            let content = `No resources found tagged: ${tags}`;
            let mon_tags = await mongo.Tag.find({'tag': {'$in': tags}}),
                tag_ids = mon_tags.map((tag) => {
                    return tag._id;
                });

            let resources = await model.Resource
                .find({'tags': {'$in': tag_ids}})
                .populate('user')
                .populate('tags');
            let listed = resources.map((resource) => {
                return formattedResource(resource)
            });

            response.status(200);

            if(listed.length){
                content = listed.join('\n\n');
            }

            return response.send(content);
        }
    },

    2: {
        'help': '/resource tag,tag2,tag3 http://www.web.com/\n\t\twill add that url with those tags',

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
            let existing_resource = await model.Resource.findOne({'url': link}).populate('tags').populate('user');

            if(existing_resource){
                response.status(200);
                let used = formattedResource(existing_resource);
                return response.send(`Resource already registered: \n ${used}`);
            }

            tags = tags.split(',');
            let resource = await (new model.Resource({'url': link})).save(),
                channel_name = request.body.channel_name,
                user_name = request.body.user_name,
                user = await mongo.User.findOrCreate({'username': user_name}),
                tag_models = [],
                tag_ids = []

            await Promise.all(tags.map(async (t) => {
                let mon_tag = await mongo.Tag.findOrCreate({'tag': t});
                tag_models.push(mon_tag);
                tag_ids.push(mon_tag._id)
            }));

            resource.tags = tag_ids;
            resource.user = user._id;
            resource = await resource.save();
            resource = await model.Resource.findById(resource._id).populate('tags').populate('user');
            const text = formattedResource(resource, true);

            // send to each channel that isnt channel_name
            tags.forEach((tag) => {
                try{
                    console.log(`SENDING RESOURCE ${resource.url} TO CHANNEL #${tag}`)

                    const channel = `#${tag}`;

                    request.slack.chat.postMessage(channel, text);
                }catch(e){
                    console.error(e);
                }            
            });

            // send to twitter

            // write response to slack
            const success = `Resource: ${resource.url} was successfully added! Keep sharing`;
            response.status(200);

            return response.send(success);
        }
    }
};


/**
 * function used to create a resource's response text
 *
 * @param resource resource.models.Resource
 * @return String 
 */
function formattedResource(resource, created = false){
    let user = resource.user,
        tags = resource.tags.map((tag) => {
            return tag.tag;
        }).join(', ');

    if(!created){
        return `url: ${resource.url}\n\ttags: ${tags}\n\tadded by: @${user.username}`;
    }
        
    return `New resource shared by @${user.username}\n\turl: ${resource.url}\n\ttags: ${tags}`;
}

const help = '/resource is used to add and list resources saved in the datCode community';

command.handler.add('resource', new command.StringArgumentParser(commands), help);

