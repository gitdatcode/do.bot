from tornado.options import options, define


define('debug', True)
define('ports', [9911,], help='A list of ports that the app runs on')
define('enabled_apps', ['ur_verification'],
    help=('A list of apps that are enabled and should be loaded when dobot '
        ' is loaded'))
