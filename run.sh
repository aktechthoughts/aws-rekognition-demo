#!/bin/bash

export FLASK_APP=app.py
export FLASK_RUN_HOST=0.0.0.0
export FLASK_DEBUG=1

python -m flask run --with-threads  --cert=adhoc
