FROM python:3.9
ENV DOCKER=true
COPY ./requirements.txt /code/requirements.txt
WORKDIR /code
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./ /code/backend