FROM python:3.10.9
ENV DOCKER=true
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2
COPY ./requirements.txt /code/requirements.txt
WORKDIR /code
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./ /code/backend