import importlib

from slackclient import SlackClient

from tornado import web
from tornado.escape import json_decode
from tornado.options import options

import dobot.config
from dobot.controller.home import HomeHandler
from dobot.controller.event import BaseEventsAPIHandler
from dobot.controller.command import CommandHandler


class Application(web.Application):

    def __init__(self):
        settings = {
            'debug': options.debug,
        }
        routes = (
            (r'/', HomeHandler),
            (r'/event/?', BaseEventsAPIHandler),
            (r'/command/([\w\-\.]+)/?', CommandHandler),
        )

        for app in options.enabled_apps:
            load_dobot_app(app)

        web.Application.__init__(self, routes, **settings)
        self.slack = SlackClient(options.slack_api_token)


def load_dobot_app(app_name):
    importlib.import_module(app_name)
