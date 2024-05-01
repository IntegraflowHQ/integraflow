#!/usr/bin/env bash

source ${PYTHONPATH}/activate && ${PYTHONPATH}/pip install pycurl --global-option="--with-openssl" --upgrade
