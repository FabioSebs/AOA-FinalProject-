FROM python:3.8

ADD . .

RUN pip install prettytable numpy

CMD [ "python", "main.py"]