require('dotenv').config();

const glob = require('glob'),
    path = require('path');

let crons = [];

// load crons in all of the apps
glob.sync('./apps/*/cron.js').forEach(async function(file){
    console.info(`Loading cron: ${file}`);
    const cron = require(path.resolve(file)).cron;
    crons.push(cron);
});


async function run(){
    await Promise.all(crons.map(async function(ci){
        return ci();
    })).then(function(){
        process.exit();
    });
}

run()
