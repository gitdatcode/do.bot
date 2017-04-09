"""apps will need to manually register themselves
"""
from ..error import DoBotAppExcpetion


DOBOT_EVENT_APPS = {}
DOBOT_COMMAND_APPS = {}


def register_event_app(event, handler, force=False):
    """this method handles registering an app as an event-based dobot handler

    the handler function's signature should be:
        tornado.web.request request, Dict body

    ie:
        def my_handler(request, body)
    """
    if event in DOBOT_EVENT_APPS and not force:
        message = ('dobot has already registered an application that handles'
            ' the event: {} that handler: {} is trying to'
            ' register'.format(event, str(handler)))
        raise DoBotAppExcpetion(message)

    DOBOT_EVENT_APPS[event] = handler


def handle_event(request, event, body):
    if event not in DOBOT_EVENT_APPS:
        message = ('The event: {} is not registered to dobot'.format(event))
        raise DoBotAppExcpetion(message)

    return DOBOT_EVENT_APPS[event](request, body)


def register_command_app(command, handler, force=False):
    if command in DOBOT_COMMAND_APPS and not force:
        message = ('dobot has already registered an application that handles'
            ' the command: {} that handler: {} is trying to'
            ' register'.format(command, str(handler)))
        raise DoBotAppExcpetion(message)

    DOBOT_COMMAND_APPS[command] = handler


def handle_command(reqeust, command, arguments):
    if command not in DOBOT_COMMAND_APPS:
        message = ('The command: {} is not registered to dobot'.format(
            command))
        raise DoBotAppExcpetion(message)

    return DOBOT_COMMAND_APPS[command](reqeust, arguments)
