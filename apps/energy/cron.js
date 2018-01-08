process.env.TZ = 'America/New_York'; 

const model = require('./model'),
    utils = require('../../utils'),
    mongo = require('../../models/mongo'),
    slack = require('../../models/slack').slack_client,
    now = new Date(),
    hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours(),
    ampm = now.getHours() > 12 ? 'pm' : 'am',
    minute = now.getMinutes();


module.exports = {
    'cron': async function(){
        let check_minute = 0;
console.log(`Checking energy for ${hour}:${minute} ${ampm}`)
        if(minute >= 45){
            check_minute = 45;
        }else if(minute >= 30){
            check_minute = 30;
        }else if(minute >= 15){
            check_minute = 15;
        }

        let users = await mongo.User.find({
            'notification_hour': hour,
            'notification_minute': check_minute,
            'notification_ampm': ampm,
        });
        console.log('users', users)

        if(!users.length){
            return
        }

        return new Promise((resolved, rej) => {
            users.forEach((user) => {
                console.log('user', user.id)
                const un = `${user.slack_id}`;
                console.log(un)
                let today = (now.getMonth() + 1) + '/' + now.getDate() +'/'+ now.getFullYear();
                let message = {
                    "callback_id": `energy_${user.slack_id}_${today}`,
                    'color': utils.randomColor(),
                    'text': `What's your energy like today. ?`,
                    'actions': [
                        {
                            'name': 'launcher',
                            'text': `Record Energy for: ${today}`,
                            'type': 'button',
                            'value': `daily_form ${user.username} ${today}`
                        }
                    ]
                };
                slack.chat.postMessage(un, '', {'attachments': [message]},  function(err, response){
                    if(err){
                        return rej(err);
                    }

                    return resolved(response)
                })    
            });
        })
    }
};
