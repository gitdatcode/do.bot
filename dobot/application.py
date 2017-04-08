import importlib

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

        for app in options.enabled_apps:
            load_dobot_app(app)

        web.Application.__init__(self, routes, **settings)


def load_dobot_app(app_name):
    importlib.import_module(app_name)

