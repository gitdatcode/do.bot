from tornado import httpserver, ioloop
from tornado.options import options

import dobot.config
from dobot.application import Application


if __name__ == '__main__':
    try:
        for port in options.ports:
            application = Application()
            http_server = httpserver.HTTPServer(application)

            http_server.listen(port)
            print('CLIENT STARTED ON PORT: ', port)

        ioloop.IOLoop.current().start()
    except Exception as e:
        # log this frfr
        print(e)