const command = require('../../controllers/command'),
    action = require('../../controllers/action'),
    createCsvWriter = require('csv-writer').createObjectCsvWriter;

const homedir = require('os').homedir();
const month_names = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const csv_headers = [
    {
        id: 'first_name',
        title: 'First Name'
    },
    {
        id: 'last_name',
        title: 'Last Name'
    },
    {
        id: 'public',
        title: 'Public'
    },
    {
        id: 'hype',
        title: 'hype'
    },
    {
        id: 'more_hype',
        title: 'More Hype'
    }
];

function getHypeForm(data) {
    data = data || {};

    // allow one month before and after current month
    let months = [],
        date = new Date(),
        current = date.getMonth(),
        start = Math.max(0, current - 1), 
        end = Math.min(11, current + 1);

    for(var i = start; i < end; i++){
        months.push({
            'label': month_names[i],
            'value': i + 1 // real month value
        });
    }

    return {
        'title': title,
        'callback_id': 'manage_hype::'+ data.id || 'new',
        'submit_label': 'Add your HYPE',
        'elements' : [
            {
                'type': 'text',
                'label': 'First Name',
                'name': 'first_name',
                'value': data.first_name || '',
            },
            {
                'type': 'text',
                'label': 'Last Name',
                'name': 'last_name',
                'value': data.last_name || '',
                'hint': "we'll only use your initial on the website"
            },
            {
                'type': 'textarea',
                'label': 'Hype yourself! What achievements (large or small!), are you celebrating this month?',
                'name': 'hype',
                'value': data.hype || '',
            },
            {
                "label": "Can we share this across our social media (twitter, instagram, linkedin, facebook, etc)?",
                "type": "select",
                "name": "public",
                "options": [
                    {
                        "label": "No",
                        "value": "no"
                    },
                    {
                        "label": "Yes",
                        "value": "yes"
                    }
                ]
            },
            {
                'type': 'textarea',
                'label': "Anything else you're celebrating?",
                'name': 'more_hype',
                'value': data.more_hype || '',
                'hint': 'optional',
                'optional': true
            },
            {
                "label": "Which month are you hyping?",
                'type': 'select',
                'name': 'month',
                'options': months
            }
        ]
    };
}

const commands = {
    0: {
        'help': '/hype\n\twill trigger a dialog to add a new HYPE REPORT entry for the given month',

        'command': function(request, response) {
            let form = getHypeForm();

            response.status(200);

            request.slack.dialog.open(JSON.stringify(form), request.body.trigger_id, function(err, res){
                response.status(200);
                response.send('');
            });
        }
    }
};

/**
 * this function will save the user's hype to a local csv file and notify the user
 * that it was saved
 */
const manage_hype = async function(request, response){
    try{
        let sub = request.payload.submission,
            month = reqest.payload.month,
            user_id = request.payload.user.id,
            date = new Date(),
            year = date.getFullYear();

        let csv = createCsvWriter({
            path: `${homedir}/hype-reports/${month}-${year}.csv`,
            header: csv_headers,
            append: true
        });

        let data = [{
            first_name: sub.first_name,
            last_name: sub.last_name,
            public: sub.public,
            hype: sub.hype,
            more_hype: sub.more_hype
        }];

        csv.writeRecords(data).then(function(){
            response.status(200);
            const month_name = month_names[month];
            const success = `Thanks for sharing your ${month_name}, ${year} hype! We will share it with the community, and the world, soon!`;
            request.slack.chat.postMessage(user_id, success, function(e, r){
                response.status(200);
                response.send('');
            });
        });
    }catch(e){
        console.error(`there was an error with the hype submission ${e}`);
    }
}

const help = '/hype is a way for DATCODE community members to add their successess to the monthly HYPE REPORT';

command.handler.add('hype', new command.StringArgumentParser(commands), help);
action.handler.add('manage_hype', manage_hype);
