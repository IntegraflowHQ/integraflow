FROM python:3.9-slim-buster
ARG DEBIAN_FRONTEND=noninteractive

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

ENV PIP_DEFAULT_TIMEOUT=100 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libpng-dev \
    libjpeg-dev

# Clean up the package cache to reduce the image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

RUN adduser --disabled-password user

RUN pip install poetry

WORKDIR /backend

COPY --chown=user:user requirements.txt requirements.txt
COPY --chown=user:user requirements_dev.txt requirements_dev.txt
COPY --chown=user:user poetry.lock poetry.lock
COPY --chown=user:user pyproject.toml pyproject.toml

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction

COPY --chown=user:user . .

USER user

