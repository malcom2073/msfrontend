"""Example Google style docstrings.

This module demonstrates documentation as specified by the `Google Python
Style Guide`_. Docstrings may extend over multiple lines. Sections are created
with a section header and a colon followed by a block of indented text.

Example:
    Examples can be given using either the ``Example`` or ``Examples``
    sections. Sections support any reStructuredText formatting, including
    literal blocks::

        $ python example_google.py

Section breaks are created by resuming unindented text. Section breaks
are also implicitly created anytime a new section starts.

Attributes:
    module_level_variable1 (int): Module level variables may be documented in
        either the ``Attributes`` section of the module docstring, or in an
        inline docstring immediately following the variable.

        Either form is acceptable, but the two should not be mixed. Choose
        one convention to document module level variables and be consistent
        with it.

Todo:
    * For module TODOs
    * You have to also use ``sphinx.ext.todo`` extension

.. _Google Python Style Guide:
   https://google.github.io/styleguide/pyguide.html

"""
from . import app
import jwt
import pprint
import hashlib
from flask import Request
def decode_auth_token(auth_token):
    payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
    return payload['sub']




# Pulls the auth token out of a request if it exists in the Authorization header
def getAuthToken(request):
    auth_header = request.headers.get('Authorization')
    auth_token = ''
    if auth_header:
        try:
            auth_token = auth_header.split(" ")[1]
            return auth_token
        except:
            pass
    return None



def getJwt(request: Request):
    """Get JSON Web Token from a Flask Request Object.

    Args:
        request (Request): Request from Flask

    Returns:
        Object: The JWT object on success, None otherwise.

    """
    auth_token = getAuthToken(request)
    pprint.pprint(auth_token)
    if auth_token:
        try:
            resp = decode_auth_token(auth_token)
            pprint.pprint(resp)
            print("Cookies")
            pprint.pprint(request.cookies)
            if resp:
                if 'mspysid' in request.cookies:
                    session = request.cookies['mspysid']
                    m = hashlib.sha256()
                    if session is not None:
                        m.update(session.encode('utf-8'))
                        if m.hexdigest() != resp['session']:
                            print('Invalid hex')
                            return None
                    else:
                        print('No session var')
                        return None
                    return resp
        except Exception as ex:
            print('Exception')
            print(str(ex))
            return None
    return None

