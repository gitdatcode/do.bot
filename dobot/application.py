from tornado import web
from tornado.escape import json_decode
from tornado.options import options

import dobot.config


class BaseHandler(web.RequestHandler):

    def get(self):
        self.write('dobot home')


class BaseEventsAPIHandler(web.RequestHandler):

    def get(self):
        pass

    def post(self):
        body = json_decode(self.request.body)
        req_type = body.get('type', None)

        if req_type == 'url_verification':
            self.set_status = 200
            self.set_header('Content-type', 'application/x-www-form-urlencoded')
            self.write(body.get('challenge'))


class Application(web.Application):

    def __init__(self):
        settings = {
            'debug': options.debug,
        }
        routes = (
            (r'/', BaseHandler),
            (r'/event', BaseEventsAPIHandler),
        )

        web.Application.__init__(self, routes, **settings)
