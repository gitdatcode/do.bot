require('dotenv').config();

const glob = require('glob');


// load crons in all of the apps
glob.sync('./apps/*/cron.js').forEach(function(file){
    console.info(`Loading cron: ${file}`);
    const cron = require(path.resolve(file)).cron;

    await cron();
});
