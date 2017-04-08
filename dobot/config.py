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
define('extra_config', os.path.join('/home', 'dobot', 'dobot.config.py'),
    help=('path to any extra configuration file used to overwrite '
        ' settings defiend in this file'))

if os.path.exists(options.extra_config):
    options.parse_config_file(options.extra_config)
