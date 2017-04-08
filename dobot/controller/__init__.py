from tornado import web


class BaseHandler(web.RequestHandler):

    def __init__(self, application, request, **kwargs):
        super(BaseHandler, self).__init__(application, request, **kwargs)
        self.slack = self.application.slack
