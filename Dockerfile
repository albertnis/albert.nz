FROM node:12-buster

WORKDIR /project

COPY package.json .
COPY package-lock.json .

RUN ["npm", "i"]

COPY content content
COPY src src
COPY static static

COPY gatsby-*.js ./

ENTRYPOINT ["npm", "run-script", "develop"]
