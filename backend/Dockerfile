FROM ubuntu
ARG DEBIAN_FRONTEND=noninteractive

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

RUN apt-get update

# Add deadsnakes PPA to get Python 3.9
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:deadsnakes/ppa
RUN apt-get update

RUN apt-get install -y  --no-install-recommends \
    curl python3.9 python3.9-dev python3-pip python3.9-venv \
    build-essential libpq-dev libpng-dev libjpeg-dev \
    && rm -rf /var/lib/apt/lists/*

# Set python3.9 as default python
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.9 10

RUN curl -sSL https://install.python-poetry.org | python -

# Add poetry to PATH
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /backend

COPY requirements.txt requirements.txt
COPY requirements_dev.txt requirements_dev.txt
COPY poetry.lock poetry.lock
COPY pyproject.toml pyproject.toml

RUN poetry config virtualenvs.in-project true
RUN poetry lock
RUN poetry export --without-hashes -f requirements.txt -o requirements_dev.txt --with dev
RUN poetry install --no-interaction

COPY . .
