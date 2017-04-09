from tornado.escape import json_decode

from . import BaseHandler
from ..apps import handle_command


class CommandHandler(BaseHandler):

    def get(self, command):
        body = json_decode(self.request.body)

        return handle_command(self, command, body)
