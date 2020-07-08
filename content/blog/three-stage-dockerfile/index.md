---
title: Three-stage Dockerfile for fun and profit
description: Making builds consistent and flexible with a single Dockerfile
date: 2020-07-09 18:47:25 +1200
accent: rgb(34, 139, 119)
---

[Multi-stage Dockerfiles][multi-stage-dockerfile] are all the rage. Typically

```dockerfile
FROM node:14-buster as build
WORKDIR /project
COPY package.json .
COPY package-lock.json .
RUN npm i

COPY helloworld.ts .
RUN ["npm", "run-script", "build"]

FROM node:14-buster-slim as runtime
COPY --from=build /project/dist/helloworld.js .
ENTRYPOINT ["node", "helloworld.js"]
```

```dockerfile{10,11}
FROM node:14-buster as build
WORKDIR /project
COPY package.json .
COPY package-lock.json .
RUN npm i

COPY helloworld.ts .
RUN ["npm", "run-script", "build"]

FROM scratch as export
COPY --from=build /project/dist/helloworld.js .

FROM node:14-buster-slim as runtime
COPY --from=build /project/dist/helloworld.js .
ENTRYPOINT ["node", "helloworld.js"]
```

[multi-stage-dockerfile]: https://docs.docker.com/develop/develop-images/multistage-build/
