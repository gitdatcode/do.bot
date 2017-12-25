const command = require('../../controllers/command'),
    action = require('../../controllers/action'),
    mongo = require('../../models/mongo'),
    utils = require('../../utils'),
    model = require('./model'),
    uuid = require('uuid');


const hydt = '/home/dobot/hydt/env/bin/python /home/dobot/hydt/hydt.py';


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
                response.write('Hey');
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

            await user.save();

            return response.status(200).send('');
        }
    }
};


const help = '/energy ';

command.handler.add('energy', new command.StringArgumentParser(commands), help);
action.handler.add('energy', new action.StringArgumentParser(actions), 'N/A');

