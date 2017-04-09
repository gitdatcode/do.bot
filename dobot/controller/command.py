from . import BaseHandler
from ..apps import handle_command


class CommandHandler(BaseHandler):

    def post(self, command):
        return handle_command(self, command, self.request.arguments)
