from . import BaseHandler


class HomeHandler(BaseHandler):

    def get(self):
        self.write('dobot home')
