require('dotenv').config();

const WebClient = require('@slack/client').WebClient,
    slack_api_token = process.env.SLACK_API_TOKEN,
    slack_web_client = new WebClient(slack_api_token);


module.exports = {
    'slack_client': slack_web_client
}
