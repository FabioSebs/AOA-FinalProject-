FROM python:3.8

ADD . .

RUN pip install prettytable numpy fastapi uvicorn

CMD [ "python", "main.py"]
