FROM python:3.9-slim-buster
ARG DEBIAN_FRONTEND=noninteractive

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

ENV PIP_DEFAULT_TIMEOUT=100 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    POETRY_VIRTUALENVS_CREATE=false

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    supervisor

# Clean up the package cache to reduce the image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

# Install setuptools==68.2.2 to avoid the following error:
# ERROR: setuptools==58.1.0 is used in combination with setuptools-scm>=8.x
RUN pip install setuptools==68.2.2

WORKDIR /backend

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord"]
