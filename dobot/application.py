from tornado import web
from tornado.escape import json_decode
from tornado.options import options

import dobot.config
from dobot.controller.home import HomeHandler
from dobot.controller.event import BaseEventsAPIHandler


class Application(web.Application):

    def __init__(self):
        settings = {
            'debug': options.debug,
        }
        routes = (
            (r'/', HomeHandler),
            (r'/event', BaseEventsAPIHandler),
        )

        web.Application.__init__(self, routes, **settings)

        for app in options.enabled_apps:
            load_dobot_app(app)


def load_dobot_app(app_name):
    __import__('dobot.apps', fromlist=[app_name,])
