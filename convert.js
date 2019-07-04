/*
  convert.js
  this file is used to convert existing resources to the new python-based app
*/

require('dotenv').config();

process.env.TZ = 'America/New_York';

const model = require('./apps/resource/models'),
    m = require('./models/mongo'),
    utils = require('./utils'),
    slack = require('./models/slack').slack_client,
    {exec} = require('child_process'),
    fs = require("fs");


function commandString(title, description, url, tags, date, username, slack_id){
    title = (title || "").replace(/"/g, '\\"');
    description = (description || "").replace(/"/g, '\\"')
    return `add_resource "${title}" "${description}" "${url}" "${tags}" "${date}" "${username}" "${slack_id}"`;
}

function runCommand(command){
    var cmd = `/home/website/env/bin/python /home/website/datcode.public/app.py ${command}`

    exec(cmd, (err, stdout, stderr) => {
        console.log(err, stdout, stderr)
    })
}

var slack_users = {},
    commands = [];

function getSlackId(username){
    var name = false;

    for(var key in slack_users) {
        if(slack_users.hasOwnProperty(key)){
            if(slack_users[key] == username){
                return key;
            }
        }
    }

    return name;
}


function getSlackUsers() {
    slack.users.list({}, function(err, resp){
        for(var i = 0, l = resp.members.length; i < l; i++){
            var member = resp.members[i];
            slack_users[member.id] = member.profile['display_name']
        }
        getResources();
    })

}

getSlackUsers()

function getResources(){
    model.Resource
        .find({})
        .populate('user')
        .populate('tags').exec()
        .then(function(resources){
            var stream = fs.createWriteStream('/tmp/neo_command.txt', {flags:'a'});

            for(var i = 0, l = resources.length; i < l; i++){
                var resource = resources[i],
                    user = resource['user'],
                    username = 'DATCODE',
                    slack_id = 'DATCODEROOTUSER';

                if(user){
                    username = user['username'];
                    slack_id = getSlackId(username);

                    if(!slack_id){
                        slack_id = 'DATCODEROOTUSER';
                    }
                }

                var tags = resource.tags.map(t => t.tag).join(',');
                var command = commandString(resource['title'], resource['description'], resource['url'], tags, resource['created_date'], username, slack_id); 
                command = `/home/website/env/bin/python /home/website/datcode.public/app.py ${command};`
console.log(command)
                stream.write(command);
            }
            stream.end();
            process.exit()
        });
}
