from tornado import web
from tornado.options import options

import dobot.config


class BaseEventsAPIHandler(web.RequestHandler):

    def get(self):
        pass


class Application(web.Application):

    def __init__(self):
        settings = {
            'debug': options.debug,
        }
        routes = (
            (r'/', BaseEventsAPIHandler),
        )

        web.Application.__init__(self, routes, **settings)
