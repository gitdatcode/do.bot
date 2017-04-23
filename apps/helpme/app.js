const command = require('../../controllers/command'),
    mongo = require('../../models/mongo'),
    model = require('./models');

const commands = {
    1: {
        'help': '/helpme tag,tag2\n\tThis command will list all of the open help tickets for tag and tag2',

        /**
         * this command is to list all open help inqueires that happen to match
         * a given tag
         */
        'command': async function(tags, request, response){
            tags = tags.split(',');
            let content = `No help entries found with tags: ${tags}`,
                mon_tags = await mongo.Tag.find({'tag': {'$in': tags}}),
                tag_ids = mon_tags.map((tag) => {
                    return tag._id;
                });

            let helpmes = await model.Helpme
                .find({
                    'resolved': {'$in': ["false", false]},
                    'tags': {'$in': tag_ids}
                })
                .populate('user')
                .populate('tags');

            let listed = helpmes.map((helpme) => {
                return formattedHelp(helpme)
            });

            response.status(200);

            if(listed.length){
                content = listed.join('\n\n');
            }

            return response.send(content);
        }
    },

    2: {
        'help': '/helpme tag,tag2 explanation of the issue you are having\n\tWhen you run this command your issue will be placed into a queue and it will also be posted in every room that corresponds to one of the defined tags, ie, "/helpme php,code how do I write a function?" will be posted in #php and #code',

        /**
         * this command is used to register new help inqueries
         * the help request will be posted in all of the relevent channels
         */
        'command': async function(tags, question, request, response){
            tags = tags.split(',');
            let user_name = request.body.user_name,
                user = await mongo.User.findOrCreate({'username': user_name}),
                tag_models = [],
                tag_ids = []

            await Promise.all(tags.map(async (t) => {
                let mon_tag = await mongo.Tag.findOrCreate({'tag': t});
                tag_models.push(mon_tag);
                tag_ids.push(mon_tag._id)
            }));

            let now = new Date();
            let helpme = await (new model.Helpme({
                'question': question,
                'tags': tag_ids,
                'user': user._id,
                'resolved': false,
                'created_date': now
            })).save();
            helpme = await model.Helpme.findById(helpme._id).populate('user').populate('tags');
            let message = formattedHelp(helpme);

            request.messageChannel(tags, message);

            let resp = 'Great news, your question has been sent out to the datCode community and will be addressed shortly!';

            response.status(200);
            return response.send(resp);
        }
    },

    'resolve': {
        'help': '/helpme resolve $ticket_id\n\tThis will mark a helpme issue as resolved',

        /**
         * this command will mark a help inquery as resloved
         * it will return error messages if the help is not valid or it has
         * already has been resolved.
         * if the proccess is okay, the helpme is marked resovled and the 
         * user who asked the question is notified
         */
        'command': async function(input, request, response){
            let parts = input.trim().split(' '),
                id = parts.shift(),
                comment = parts.join(' ');

            let helpme = await model.Helpme.findById(id)
                .populate('user').populate('tags').exec();

            if(!helpme){
                response.status(200);
                return response.send(`Helpme with the id: ${id} does not exist`);
            }

            if(helpme.resolved){
                response.status(200);
                return response.send(`Helpme with the id: ${id} was already resolved by ${helpme.user.username} at ${helpme.date_resolved}`);
            }

            let user_name = request.body.user_name,
                user = await mongo.User.findOrCreate({'username': user_name}),
                now = new Date();

            let updated = await helpme.update({
                'resolved': true,
                'resolved_date': now,
                'resolved_user': user
            }).exec();

            if(!updated){
                response.status(200);
                return response.send(`There was an error with marking the helpme: ${id} resolved.`);
            }

            let dm = `Your helpme inquiry: "${helpme.question}" has been marked resolved by ${user.username} @ ${now}`,
                message = `You have marked helpme: ${id} as resolved. Thank you, keep it up!`;

            request.messageUser([helpme.user.username], dm);

            response.status(200);

            return response.send(message);
        }
    }
};


function formattedHelp(helpme, resolved = false){
    let user = helpme.user,
        tags = helpme.tags.map((tag) => {
            return tag.tag;
        }).join(', ');

    return `${helpme.question}\n\tid: ${helpme._id}\n\ttags: ${tags}`;
}


const help = '/helpme is a simple utility that allows that datCode community to easily help each other.';

command.handler.add('helpme', new command.StringArgumentParser(commands), help);
