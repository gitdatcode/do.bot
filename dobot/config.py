import os

from tornado.options import options, define


define('debug', True)
define('ports', [9911,], help='A list of ports that the app runs on')
define('enabled_apps', ['dobot.apps.url_verification'],
    help=('A list of apps that are enabled and should be loaded when dobot '
        ' is loaded. Each app should be a full path to the module.'))
define('slack_api_token', 'NOTSET', help=('The api token used to communicate'
    ' with the slack server'))


# overwrite configurations with enviromental settings
extra_config = os.path.join('home', 'dobot', 'dobot.config.py')

if os.path.exists(extra_config):
    options.parse_config_file(extra_config)
