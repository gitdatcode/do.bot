const exec = require('child_process').execSync;


const hydt = '/home/dobot/hydt/env/bin/python /home/dobot/hydt/hydt.py',
    exe = {
        'emoji': function(){
console.log('>>>>>', `${hydt} emoji`)
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

            return JSON.parse(js);
        },
        'user_score_range': function(user_id, start_date, end_date){
            let js = exec(`${hydt} user_score_range -u ${user_id} --sdate ${start_date} --edate ${end_date}`);

            return JSON.parse(js);
        },
        'week_report': function(user_id, week, year){
            let script = `${hydt} generate_week -u ${user_id} -w ${week} -y ${year}`,
                js = exec(script);
console.log(script)
            return JSON.parse(js);
        },
    };

module.exports = exe;
