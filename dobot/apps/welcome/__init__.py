from tornado.escape import json_decode

from .. import register_event_app


def welcome_to_datcode(request, body):
    """The function handles sending a welcome message ot the new user"""
    request.set_status = 200
    # request.set_header('Content-type', 'application/x-www-form-urlencoded')
    #
    # return request.write(body.get('challenge'))


register_event_app('team_join', welcome_to_datcode)
