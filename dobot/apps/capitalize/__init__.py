from tornado.escape import json_decode

from .. import register_command_app


def capitalize(request, arguments):
    request.set_status = 200
    text = arguments.get('text', '')
    text = [t.decode("utf-8") for t in text]
    text = ''.join(text)
    response = {
        'response_type': 'in_channel',
        'text': str(text.upper()),
    }
    return request.write(response)


register_command_app('cap', capitalize)
