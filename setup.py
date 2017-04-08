"""
do.bot
------

do.bot is a general purpose server that makes communicating with Slack servers
simple
"""
import sys
from setuptools import setup, find_packages


with open('requirements.txt') as f:
    required = f.read().splitlines()

install_requires = required

# get the version information
exec(open('dobot/version.py').read())

setup(
    name = 'dobot',
    packages = find_packages(),
    version = __version__,
    description = 'Server for Slackbots',
    url = 'https://github.com/gitdatcode/do.bot',
    author = 'Mark Henderson',
    author_email = '',
    long_description = __doc__,
    install_requires = install_requires,
)
