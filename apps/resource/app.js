const command = require('../../controllers/command'),
    action = require('../../controllers/action'),
    mongo = require('../../models/mongo'),
    model = require('./models'),
    exe = require('./exe');


let colors = ['#00E8EF', '#5C03DB', '#EF005E', '#FFBD03', '#00D675'],
    color_used = 0,
    color_len = colors.length - 1,
    next_color = function(){
        if(color_used > color_len){
            color_used = 0;
        }

        var color = colors[color_used];
        color_used += 1;

        return color;
    };


function resourceForm(data){
    let title = data ? 'Edit Resource' : 'Add Resource';
    data = data || {};

    return {
        'title': title,
        'callback_id': 'manage_resource::'+ data.id || 'new',
        'submit_label': 'Save',
        'elements' : [
            {
                'type': 'text',
                'label': 'Url',
                'name': 'url',
                'value': data.url || '',
            },
            {
                'type': 'text',
                'label': 'Tags',
                'name': 'tags',
                'value': data.tags || '',
                'hint': 'Comma,separated,tags,spaces are fine',
            },
            {
                'type': 'textarea',
                'label': 'Description',
                'name': 'description',
                'value': data.description || '',
                'hint': 'Add a useful synopsis of the resource. It will be searhable with this content.',
            }
        ]
    };
}



const commands = {
    0: {
        'help': '/resource\n\t\tWill trigger a dialog to add a new resource',

        'command': function(request, response){
            let form = resourceForm();

            response.status(200);

            request.slack.dialog.open(JSON.stringify(form), request.body.trigger_id, function(err, res){
                response.status(200);
                response.send('');
            });
        }
    },
    1: {
        'help': '/resource tag,tag2,tag3\n\t\twill return all resources with the given tags',

        /**
         * This command is designed to return a list of all resources that
         * match the tags that are passed in with the request.
         * If there are no matches an string stating as much will be returned
         */
        'command': async function(tags, request, response){
            let content = await getTagsForRequest(tags, request, response);

            response.status(200);
            return response.send(content);
        }
    },

/*    2: {
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
  /*      'command': async function(tags, link, request, response){
            return await commands[3].command(tags, link, '', request, response);
        }
    },

    3: {
        'help': '/resource tag,tag2 mark.com I love this website. It really helps me be cool\n\t\twill add that url with tags and a description',

        'command': async function(tags, link, description, request, response){
            let existing_resource = await model.Resource.findOne({'url': link}).populate('tags').populate('user');

            if(existing_resource){
                let existing = `Resource already registered search for it by typing \`/resource ${tags}\``;

                response.status(200);
                return response.send(existing);
            }

            let data = {
                    'url': link,
                    'description': description,
                    'tags': tags,
                },
                form = resourceForm(data);

            response.status(200);

            request.slack.dialog.open(JSON.stringify(form), request.body.trigger_id, function(err, res){
                response.status(200);
                response.send('');
            });
        }
    }
*/
};


const actions = async function(request, response){
    let tags = request.action_value.join(''),
        content = await getTagsForRequest(tags, request, response);
    content['replace_original'] = false;
    response.status(200);

    return response.send(content);
}


const manage_resource = async function(request, response){

    try{
        let submission = request.payload.submission,
            tags = submission.tags,
            link = submission.url,
            description = submission.description,
            username = request.payload.user.name,
            slack_id = request.payload.user.id;
        let date = Date.now();
        let title = '';
        let resp = await exe.add(title, description, link, tags, date, username, slack_id); 
        tags = tags.split(',');
        let r = {
            data: {
                resources: [resp.data],
            }
        };
        let formatted_response = formattedResponse(tags, r, true);

        if(tags.indexOf('resources') < 0){
           tags.push('resources');
        }

        // send to each channel that isnt channel_name
        let message = formatted_response.text,
            resource = resp,
            attachments = {'attachments': formatted_response.attachments},
            user_name = request.body.user_name || request.payload.user.name,
            user = resp.data.user;
        await notifiyChannels(tags, message, resource, attachments, request, response);

        // write response to slack
        const success = `Resource: ${resp.data.resource.uri} was successfully added! Keep sharing`;
        response.status(200);
        request.slack.chat.postMessage(user.slack_id, success, function(e, r){
            response.status(200);
            response.send('');
        });
    }catch(e){
        console.log('>>>>>>', e)
    }
}

/**
 * function used to create a resource's response text with buttons for the user
 * to click and get responses back for more tags
 *
 * @param resource resource.models.Resource
 * @return Object 
 */
function formattedResource(resource, created = false){
    if(!resource.resource){
        return []
    }

    if(!resource.tags){
        resource.tags = [];
    }

    if(!resource.user){
        resource.user = {
            username: 'DATCODEUSER'
        }
    }

    let user = resource.user,
        tags = resource.tags.map((tag) => {
            return {
                'name': 'tag',
                'text': tag.tag,
                'type': 'button',
                'value': 'resource #'+ tag.tag,
            }
        }),
        color = next_color();
 
    let fields = [
        {
            'title': 'Added by',
            'value': `${resource.user.username}`,
            'short': true,
        }
    ];

    if(resource.resource.created_date){
        fields.push({
            'title': 'Date Added',
            'value': resource.resource.created_date.toLocaleDateString("en-US"),
            'short': true,
        })
    }

    var url = {    
            'title': 'Url',
            'text': resource.resource.uri,
            'color': color,
        }
        response = [];

    response.push(url);

    if(resource.resource.description && resource.resource.description != 'false' && resource.resource.description != ''){
        response.push({
            'title': 'Description',
            'text': resource.resource.description,
            'color': color,
            'fields': fields,
        })
    }else{
        url['fields'] = fields;
    }
   
    var tag_section = {
        'title': 'tags',
        'fallback': 'tags',
        'callback_id': 'random',
        'attachment_type': 'default',
        'actions': tags,
    };

    response = response.concat(tag_section);

    return response;
}


function formattedResponse(search, resources, created = false){
    var attachments = [];
    resources.data.resources.forEach((resource) => {
        let res = formattedResource(resource, created);
        attachments = attachments.concat(res);
    });

    return {
        'text': created ? 'New Resource Added' : `Resources: ${search}`,
        'attachments': attachments,
    };
}


async function getTagsForRequest(search, request, response){
    let content = `No resources found from: ${search}`;
    let resources = await exe.search(search);

    if(resources.data.resources.length){
        content = formattedResponse(search, resources);
    }

    return content;
}


async function addResource(tags, link, description, request, response){
    let now = new Date(),
        resource = await (new model.Resource({
            'url': link, 
            'created_date': now,
            'description': description
        })).save(),
        channel_name = request.body.channel_name,
        user_name = request.body.user_name || request.payload.user.name,
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

    return {
        'resource': resource, 
        'response': formattedResponse(tags, [resource], true)
    };
}


async function notifiyChannels(channels, message, resource, attachments, request, response){
    channels.forEach((chan) => {
        try{
            console.log(`SENDING RESOURCE ${resource.url} TO CHANNEL #${chan}`)

            const channel = `#${chan}`;

            request.slack.chat.postMessage(channel, message, attachments);
        }catch(e){
            console.error(`!!!!error trying to post to chan #${chan}`);
            console.error(e);
        }
    });
}


const help = '/resource is used to add and list resources saved in the datCode community';

command.handler.add('resource', new command.StringArgumentParser(commands), help);
//action.handler.add('resource', new action.StringArgumentParser(actions), 'N/A');
action.handler.add('resource', actions);
action.handler.add('manage_resource', manage_resource);
