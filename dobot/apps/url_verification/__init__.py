from dobot.apps import register_event_app


def verifiy_url(request, body):
    """this function handles verification requests from the slack api server
    as of now, it simply responds to the request by returning the
    `challenge`

    @TODO: store the token and verify that the request is indeed coming from
    the slack server
    """
    request.set_status = 200
    request.set_header('Content-type', 'application/x-www-form-urlencoded')
    return request.write(body.get('challenge'))


register_event_app('url_verification', verifiy_url)
