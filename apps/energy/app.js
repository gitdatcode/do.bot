const command = require('../../controllers/command'),
    action = require('../../controllers/action'),
    mongo = require('../../models/mongo'),
    utils = require('../../utils'),
    model = require('./model'),
    uuid = require('uuid'),
    exec = require('child_process').execSync;


const hydt = '/home/dobot/hydt/env/bin/python /home/dobot/hydt/hydt.py',
    exe = {
        'emoji': function(){
            let js = exec(`${hydt} emoji`);

            return JSON.parse(js);
        },
        'colors': function(){
            let js = exec(`${hydt} colors`);

            return JSON.parse(js);
        },
        'score': function(emoji){
            let js = exec(`${hydt} score -e '${emoji}'`);

            return JSON.parse(js);
        },
        'user_score': function(user_id, emoji, date, notes){
            notes = notes || '';
            let js = exec(`${hydt} user_score -u ${user_id} -e '${emoji}' -d '${date}' -n '${notes}'`);
console.log(`${hydt} user_score -u ${user_id} -e '${emoji}' -d '${date}'  -n '${notes}'`)
            return JSON.parse(js);
        },
        'user_score_range': function(user_id, start_date, end_date){
            let js = exec(`${hydt} user_score_range -u ${user_id} -sdate ${start_date} -edate ${end_dae}`);

            return JSON.parse(js);
        },
    };

var emoji = exe.emoji(),
    emoji_values = emoji,
    emoji = Object.keys(emoji),
    colors = Object.values(exe.colors());


async function registrationForm(user_name){
    let user = await mongo.User.findOrCreate({'username': user_name});

    if(!user.energy_code){
        user.energy_code = uuid.v1();
        await user.save();
    }

    return {
        'title': "DatCode's Energy App",
        'callback_id': 'energy::' + user.energy_code,
        'submit_label': 'Register!',
        'elements': [
            {
                'type': 'select',
                'label': 'Notification Hour',
                'name': 'notification_hour',
                'placeholder': 'Select the hour you want do.bot to notify you',
                'value': user.notification_hour || '11',
                'options': [
                    {
                        'label': '1',
                        'value': '1',
                    },
                    {
                        'label': '2',
                        'value': '2',
                    },
                    {
                        'label': '3',
                        'value': '3',
                    },
                    {
                        'label': '4',
                        'value': '4',
                    },
                    {
                        'label': '5',
                        'value': '5',
                    },
                    {
                        'label': '6',
                        'value': '6',
                    },
                    {
                        'label': '7',
                        'value': '7',
                    },
                    {
                        'label': '8',
                        'value': '8',
                    },
                    {
                        'label': '9',
                        'value': '9',
                    },
                    {
                        'label': '10',
                        'value': '10',
                    },
                    {
                        'label': '11',
                        'value': '11',
                    },
                    {
                        'label': '12',
                        'value': '12',
                    },
                ]
            },
            {
                'label': 'Notification Minute',
                'name': 'notification_minute',
                'type': 'select',
                'placeholder': 'Select the minute you want do.bot to notify you',
                'value': user.notification_minute || '0',
                'options': [
                    {
                        'label': '0',
                        'value': '0'
                    },
                    {
                        'label': '15',
                        'value': '15'
                    },
                    {
                        'label': '30',
                        'value': '30'
                    },
                    {
                        'label': '45',
                        'value': '45'
                    },
                ]
            },
            {
                'label': 'AM/PM',
                'type': 'select',
                'name': 'notification_ampm',
                'placeholder': 'Select the time of day you want do.bot to notify you',
                'value': user.notification_ampm || 'pm',
                'options': [
                    {
                        'label': 'AM',
                        'value': 'am'
                    },
                    {
                        'label': 'PM',
                        'value': 'pm'
                    },
                ]
            }
        ]
    };
}


async function dailyForm(username, date){
    let emoji_list = emoji.join('');

    return {
        'title': `Record energy: ${date}`,
        'callback_id': `energy_record::record ${username} ${date}`,
        'submit_label': 'Record',
        'elements': [
            {
                'label': 'Type 3 face emjoi',
                'name': 'emoji',
                'type': 'textarea',
                'hint': `Any of these: ${emoji_list}`
            },
            {
                'label': 'Type any notes',
                'name': 'notes',
                'type': 'textarea',
                'optional': true,
                'hint': 'Completely optional'
            }
        ]
    }
}


const commands = {
    'register': {
        'help': "/energy register -- register and we'll track your energy daily",

        'command': async function(register, request, response){
            let user_id = request.body.user_id,
                user_name = request.body.user_name,
                user = await mongo.User.findOrCreate({'username': user_name}),
                content = await registrationForm(user_name);

            response.status(200)
            request.slack.dialog.open(JSON.stringify(content), request.body.trigger_id, function(err, other){
                response.status(200);
                response.write('');
            });
        }
    },
};


const actions = {
     0: {
        'help': 'n/a',

        'command': async function(request, response){
            let cb = request.payload.callback_id.split('::'),
                user = await mongo.User.findOne({'energy_code': cb[1]}),
                submission = request.payload.submission;

            user.notification_hour = parseInt(submission.notification_hour, 10);
            user.notification_minute = parseInt(submission.notification_minute, 10);
            user.notification_ampm = submission.notification_ampm;
            user.slack_id = request.payload.user.id;

            await user.save();

            return response.status(200).send('');
        }
    },
    2: {
        'help': '',

        'command': async function(username, date, request, response){
            console.log('***************************************')
            console.log(username, date, request.payload.trigger_id)

            let content = await dailyForm(username, date);

            response.status(200)
            request.slack.dialog.open(JSON.stringify(content), request.payload.trigger_id, function(err, other){
                if(err){
console.log(other.response_metadata)
                    console.error(err)
                }
                response.status(200);
                response.write('');
            });
        }
    },
    3: {
        'help': '',

        'command': async function(request, response){
            let pay = request.payload,
                sub = pay.submission,
                emo = sub.emoji,
                notes = sub.notes,
                cb = pay.callback_id.split(' '),
                username = cb[1],
                date = cb[2],
                submitted_emoji = [],
                user = await mongo.User.findOne({'username': username});

            emoji.forEach((emoji) => {
                if(emo.indexOf(emoji) > -1){
                    submitted_emoji.push(emoji);
                }
            });

            submitted_emoji = submitted_emoji.join(' ');

            let resp = exe.user_score(user.slack_id, submitted_emoji, date, notes);
            let color = utils.randomColor();
            let message = {
                'title': `Your energy for ${date}`,
                'attachment_type': 'default',
                'callback_id': 'someid',
                'attachments': [
                    {
                        'title': '',
                        'color': resp.data.color_shifted,
                        'fields': [
                            {
                                'title': 'Score',
                                'value': resp.data.score,
                                'short': true
                            },
                            {
                                'title': 'Color',
                                'value': resp.data.color_shifted,
                                'short': true
                            }
                        ]
                    }
                ]
            }

            response.status(200);
            request.slack.chat.postMessage(user.slack_id, `Your energy for ${date}`, message, function(er, res){
                response.status(200);
                response.send('');
            })
        }
    }
};


const help = '/energy ';

command.handler.add('energy', new command.StringArgumentParser(commands), help);
action.handler.add('energy', new action.StringArgumentParser(actions), 'N/A');
action.handler.add('energy_record', new action.StringArgumentParser({0: actions[3]}), 'N/A');

