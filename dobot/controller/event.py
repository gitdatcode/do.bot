from . import BaseHandler
from ..apps import handle_event


class BaseEventsAPIHandler(BaseHandler):

    def post(self):
        body = json_decode(self.request.body)
        req_type = body.get('type', None)

        if not req_type:
            pass

        return handle_event(event=req_type, body=body)
