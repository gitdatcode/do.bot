const model = require('./model'),
    mongo = require('../../models/mongo'),
    now = new Date(),
    hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours(),
    minute = now.getMinutes();


module.exports = {
    'cron': async function(){
        let check_minute = 0;

        if(minute >= 45){
            check_minute = 45;
        }else if(minute >= 30){
            check_minute = 30;
        }else if(minute >= 15){
            check_minute = 15;
        }

        let users = await mongo.User.find({
            'notification_hour': hour,
            'notification_minute': check_minute
        });
        console.log(users)
    }
};
