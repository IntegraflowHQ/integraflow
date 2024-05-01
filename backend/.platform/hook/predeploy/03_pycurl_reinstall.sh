#!/usr/bin/env bash

source ${PYTHONPATH}/activate && ${PYTHONPATH}/pip3 install pycurl --global-option="--with-openssl" --upgrade
