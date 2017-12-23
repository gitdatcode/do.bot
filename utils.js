const slack = require('./models/slack').slack_client;


/**
 * function used to send a message to a list of channels
 *
 * @param channel_list Aarray -- list of channels
 * @param message String -- message to be sent
 */
function messageChannel(channel_list, message){
    channel_list = !Array.isArray(channel_list) ? [channel_list] : channel_list;

    channel_list.forEach((channel) => {
        channel = `#${channel}`;

        try{
            console.log(`Sending message to ${channel}\n ${message}`);
            slack.chat.postMessage(channel, message);
        }catch(e){
            console.info(`Error sending message to ${channel}`);
            console.error(e);
        }
    });
}


/**
 * function used to send a message to a list of users
 *
 * @param user_list Array -- list of users
 * @param message String -- message to be sent
 */
function messageUser(user_list, message){
    user_list = !Array.isArray(user_list) ? [user_list] : user_list;

    user_list.forEach((user) => {
        user = `#${user}`;

        try{
            console.log(`Sending message to ${user}\n ${message}`);
            slack.chat.postMessage(user, message);
        }catch(e){
            console.info(`Error sending message to ${user}`);
            console.error(e);
        }
    });
}

let colors = ['#00E8EF', '#5C03DB', '#EF005E', '#FFBD03', '#00D675'],
    color_used = 0,
    color_len = colors.length - 1;

function nextColor(){
    if(color_used > color_len){
        color_used = 0;
    }

    var color = colors[color_used];
    color_used += 1;

    return color;
}

module.exports = {
    'messageChannel': messageChannel,
    'messageUser': messageUser,
    'nextColor': nextColor,
}
