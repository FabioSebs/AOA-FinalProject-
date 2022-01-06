FROM golang:latest

WORKDIR /Graph

COPY ./ /Graph/

RUN go get -u

CMD ["go", "run", "."]
