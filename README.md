# dobot.py
does a bunch of stuff for the Slack group!

## Requirements

* python 2.7+
* virtualenv
* pip
* slackclient
* tornado

## Setup

Running do.bot in a virtual environment is the best approach.

### Setup a Virtual Environment

Working with virtual environments with python is pretty simple. A virtual environment will allow you to target a specific python version and install dependencies only for that environment and not globally on your system.

If you are running python 3+, setting up a virtual environment is as simple as running:

```
pyvenv env
```

If you're on python 2.7, the best way to get the tools that you need is with `pip`.

1. Download the pip setup script from here: https://pip.pypa.io/en/stable/installing/
1. Run the command `python pip.py`
1. Install virtualenv `pip install virtualenv`
1. Create the virtual environment `virtualenv env`

> If you're on Linux or have access to something like homebrew, it would be best to install pip via the package managers available on those systems.

Once you have the virtual environment, you can install do.bot.

1. Clone the repo
1. `cd /to/do.bot/`
1. Start your virtual environment `source /path/to/env/bin/activate`
1. Install do.bot `python setup.py install`

## Running do.bot

do.bot comes with simple example files for both nginx and an init.d service.

To manually run do.bot:

1. Start your virtual environment
1. `cd /path/to/do.bot/`
1. `python dobot.py`

Configuration options can be passed in at run-time or can be defined via an external python script. To use during run-time, pass the name of the option with a value:

```
python dobot.py --ports=9000,9001,9002 --slack_api_token=some_api_token
```

The available options are:

* debug[True] -- a boolean stating if the do.bot instance should run in debug mode.
* ports[9911] -- a list of ports to run the do.bot instance on.
* enabled_apps['dobot.apps.url_verification'] -- a list of packages that register event handlers for do.bot to act against.
* slack_api_token -- the api token to use with the slackclient
* extra_config -- a path to a python file that redefines the configuration options.

## How do.bot works

do.bot works by communicating intent from the Slack server to a pre-defined function. A single function can be registred as a event handler and that function is responsible for responding to the Slack request.

### Adding an Event Handler

Event handlers are simple functions that take a `tornado.web.RequestHandler` (the current web request) and a `dict` (the info sendt by Slack) to be processed. Here is the included `url_verification` handler:

```python
from dobot.apps import register_event_app


def verifiy_url(request, body):
    """this function handles verification requests from the slack api server
    as of now, it simply responds to the request by returning the
    `challenge`

    @TODO: store the token and verify that the request is indeed coming from
    the slack server
    """
    request.set_status = 200
    request.set_header('Content-type', 'application/x-www-form-urlencoded')
    return request.write(body.get('challenge'))


register_event_app('url_verification', verifiy_url)
```

To enable a handler, add the full package path the `enabled_apps` configuration option.

> the request object will have an instance of `slackclient.SlackClient` as `request.slack`. Documentation found here: http://python-slackclient.readthedocs.io/en/latest/
