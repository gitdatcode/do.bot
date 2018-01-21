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

function randomColor(){
    return colors[Math.floor(Math.random() * colors.length)];
}

function getWeek(date) {
  if (!(date instanceof Date)) date = new Date();

  // ISO week date weeks start on Monday, so correct the day number
  var nDay = (date.getDay() + 6) % 7;

  // ISO 8601 states that week 1 is the week with the first Thursday of that year
  // Set the target date to the Thursday in the target week
  date.setDate(date.getDate() - nDay + 3);

  // Store the millisecond value of the target date
  var n1stThursday = date.valueOf();

  // Set the target to the first Thursday of the year
  // First, set the target to January 1st
  date.setMonth(0, 1);

  // Not a Thursday? Correct the date to the next Thursday
  if (date.getDay() !== 4) {
    date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7);
  }

  // The week number is the number of weeks between the first Thursday of the year
  // and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000)
  return 1 + Math.ceil((n1stThursday - date) / 604800000);
}

module.exports = {
    'messageChannel': messageChannel,
    'messageUser': messageUser,
    'nextColor': nextColor,
    'randomColor': randomColor,
    'getWeek': getWeek,
}
