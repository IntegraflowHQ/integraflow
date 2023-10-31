FROM python:3.9-slim-buster
ENV PYTHONUNBUFFERED 1

RUN apt-get update && \
    apt-get -y install build-essential libpq-dev libpng-dev libjpeg-dev

RUN pip install poetry

WORKDIR /backend

COPY requirements.txt requirements.txt
COPY requirements_dev.txt requirements_dev.txt
COPY poetry.lock poetry.lock
COPY pyproject.toml pyproject.toml

RUN poetry config virtualenvs.in-project true
RUN poetry lock
RUN poetry export --without-hashes -f requirements.txt -o requirements_dev.txt --with dev
RUN poetry install

COPY . .

RUN adduser --disabled-password user
USER user

CMD ["poetry", "run", "python", "manage.py", "runserver"]
