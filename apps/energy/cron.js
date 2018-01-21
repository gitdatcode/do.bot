process.env.TZ = 'America/New_York'; 

const model = require('./model'),
    exe = require('./exe'),
    utils = require('../../utils'),
    mongo = require('../../models/mongo'),
    slack = require('../../models/slack').slack_client,
    now = new Date(),
    hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours(),
    ampm = now.getHours() > 12 ? 'pm' : 'am',
    minute = now.getMinutes(),
    day = now.getDay(),
    today = (now.getMonth() + 1) + '/' + now.getDate() +'/'+ now.getFullYear(),
    week = utils.getWeek(now);


module.exports = {
    'cron': async function(){
        let check_minute = 0;

        console.log(`Checking energy for ${hour}:${minute} ${ampm}`)

        /**
         * create the user check
         */
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

        let funcs = [];

        if(users.length){
            var p = new Promise((resolved, rej) => {
return
                users.forEach((user) => {
                    console.log('user', user.id)
                    const un = `${user.slack_id}`;
                    console.log(un)

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
                            rej(err)
                        }
                        resolved()
                    })    
                });
            });

            funcs.push(p);
        }

        /**
         * create the weekly render check mondays at 9am
         */
//        if(minute == 0 && day == 1 && hour == 9 && ampm == 'am'){
         if(1 == 1){
            let energy_users = await mongo.User.find({
                'notification_hour': {$gt: 0}
            });
console.log('>>>', energy_users)
            if(energy_users.length){
                var p = new Promise((resolved, rej) => {
                    energy_users.forEach((user) => {
                        const un = `${user.slack_id}`,
                            report = exe.week_report(user.slack_id, week, now.getFullYear());
console.log(report)

                        let message = {
                            'color': utils.randomColor(),
                            'callback_id': `energy_report_${user.slack_id}_${today}`,
                            'text': 'Your Weekly Energy Report is Ready!',
                            'fields' : [
                                {
                                    'title': '',
                                    'value': report.uri
                                }
                            ]        
                        };

                        let z = slack.chat.postMessage(un, '', {'attachments': [message]},  function(err, response){
console.log('POSTED MESAAGE')
                            if(err){
console.log(err)
                                rej(err);
                            }
console.log('POSTED', un)
                            resolved();
                        });
console.log('zzzzzzzzz', z)
                    });
                });

                funcs.push(p);
            }
        }

        return new Promise(async (res, rej) => {
            await Promise.all(funcs.map( async function(fn){
                return await fn
            })).then(function(){
                res();
            })
        });
    }
};
