from tornado.escape import json_decode

from .. import register_event_app


def verifiy_url(request, body):
    request.set_status = 200
    request.set_header('Content-type', 'application/x-www-form-urlencoded')

    return request.write(body.get('challenge'))


register_event_app('url_verification', verifiy_url)
