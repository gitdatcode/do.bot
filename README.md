# dobotjs
## Does a bunch of stuff for the Slack group!

Since we got a lot of integrations going, we thought it'd be cool to just build an app and consolidate a lot of the custom things we wanted to make.

### Requirements
 - [node](http://nodejs.org)
 - [express](http://expressjs.com)
 - [body-parser (to parse the JSON)](https://github.com/expressjs/body-parser)
 - [request (simplified HTTP requests)](https://github.com/request/request)

Also go check out the [Slack API](http://api.slack.com) for more information.

### Future updates
 - global resource posting by Slack command: use `/resource` with your topic to submit resources from any channel.
 - get help with a problem: use `/whatevercommandhere` with your question to get help from more knowledgeable members.


## Commands

With do.bot you register a simple function to handle a command:

```javascript
const command = require('../../controllers/command');

const help = 'check out my command'

function myCommandHandler(request, response){
    response.status(200);
    response.send('hi from my command');
}

command.handler.add('mycommand', myCommandHandler, help);
```

Now when someone types `/mycommand` do.bot will respond with "hi from my command", its that simple!

### Complex Commands

do.bot allows you to define simple one-off commands like above, but it also allows you to define commands within commands.

do.bot offers two classes to handle complex commands `StringArgumentParser` and `NumberArgumentParser` will allow you to define subcommands based on the number of comma-separated values that are passed with the command call. While `NumberArgumentParser` `StringArgumentParser` will match the beginning of the value passed to the command and match accordingly. `StringArgumentParser` includes an instance of `NumberArgumentParser` by default allowing both to be defined at once.

```javascript
const command = require('./controllers/command');

const commands = {
    'count': {
        'help': '/mycommand count will count the words given to the command',
        'command': function(input, request, response){
            response.status(200);
            response.send('You passed in '+ input.split(' ').length + ' words')
        }
    },
    1: {
        'help': '/mycommand any number of args',
        'command': function(input, request, response){
            response.status(200);
            response.send('one matched: ' + input)
        }
    }
}

const command_parser = new command.StringArgumentParser(commands);
command.handler.add('mycommand', command_parser, 'test help');
```

When someone types `/mycommand count how many words is this?` do.bot will respond with 'You passed in 5 words'.

If someone typed in `/mycommand hello` do.bot would match the `1` command and respond with `one matched: hello`.