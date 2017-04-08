from tornado.options import options, define


# App configurations
define('debug', True)
define('ports', [9911,], help='A list of ports that the app runs on')
