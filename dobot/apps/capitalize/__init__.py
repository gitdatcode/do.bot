from tornado.escape import json_decode

from .. import register_event_app


def capitalize(request, body):
    request.set_status = 200
    # request.set_header('Content-type', 'application/x-www-form-urlencoded')
    #
    # return request.write(body.get('challenge'))


register_event_app('caps', capitalize)
