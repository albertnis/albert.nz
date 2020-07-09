---
title: Using three-stage Dockerfile for accessing build output
description: How to make builds consistent and flexible with a single Dockerfile
date: 2020-07-09 19:17:25 +1200
accent: rgb(34, 139, 119)
links:
  - <a href="https://github.com/albertnis/demo-three-stage-dockerfile">GitHub</a>
---

[Multi-stage Dockerfiles][multi-stage-dockerfile] are a tried and true method for minimising the bloat of published docker images. The workflow is pretty typical:

1. Build an artifact using a full-fat build image
1. Move it to a minimal runtime image where it can be executed

Here's a simple example. I have a TypeScript file called [`helloworld.ts`](https://github.com/albertnis/demo-three-stage-dockerfile/blob/master/helloworld.ts). It greets people. I want to compile this file to JavaScript and run it with node. Here's a typical two-stage Dockerfile that will achieve that:

```dockerfile
FROM node:14-buster as build
WORKDIR /project
COPY package.json .
COPY package-lock.json .
RUN npm i

COPY helloworld.ts .
# Build to dist/helloworld.js
RUN ["npm", "run-script", "build"]

FROM node:14-buster-slim as runtime
COPY --from=build /project/dist/helloworld.js .
ENTRYPOINT ["node", "helloworld.js"]
```

I can use this Dockerfile to build an image and run it as a container quite easily:

```shell
docker build -t helloworld .
docker run --rm helloworld Albert
# Hello Albert!
```

Neato! So what's the problem?

# The problem

I don't always want to run the thing I'm building! Often (but not always) I just want to obtain the build output. This can be useful for uploading the artifact - such as for a GitHub release - and is achieved by adding an extra step to the process:

1. (As before) Build an artifact using a full-fat build image
1. **Move it to a scratch image where it can be exported**
1. (As before) Move it to a minimal runtime image where it can be executed

But how to add this second step to the Dockerfile?

```dockerfile
FROM node:14-buster as build
WORKDIR /project
COPY package.json .
COPY package-lock.json .
RUN npm i

COPY helloworld.ts .
# Build to dist/helloworld.js
RUN ["npm", "run-script", "build"]

# highlight-start
FROM scratch as output
COPY --from=build /project/dist/helloworld.js .
# highlight-end

FROM node:14-buster-slim as runtime
COPY --from=build /project/dist/helloworld.js .
ENTRYPOINT ["node", "helloworld.js"]
```

As before, I can build and run the script easily enough:

```shell
docker build -t helloworld .
docker run --rm helloworld Albert
# Hello Albert!
```

But now I've got a new trick up my sleeve for extricating the build output from the container:

```shell
DOCKER_BUILDKIT=1 docker build -t helloworld --target output -o dist .
ls dist
# helloworld.js
```

The key here is using a build target in combination with the `-o` flag. This flag is enabled by activating BuildKit using the environment variable. With `-o`, Docker will copy all the files from an image's filesystem into a specified folder once the build is complete. Using a `scratch` image for the `output` stage means that we're left with only the single artifact from the `build` stage.

The best part of this process is that I know that the artifact I'm building is exactly the same as what would end up in the final running Docker image. It minimises the number of miscellaneous build scripts or Dockerfiles I would otherwise need and keeps all the build steps contained in a single source of truth.

This approach is compatible with Docker-based CI/CD solutions such as GitHub actions; Docker-out-of-Docker can be used to run these build commands [within a `docker` Docker image](https://github.com/albertnis/demo-three-stage-dockerfile/blob/master/.github/actions/docker-build/Dockerfile). It's all a bit ridiculous, but works well.

# Where have I used this?

I took advantage of a three-stage Dockerfile in [mqcontrol][] where it's being used for [cross-compilation binary output](https://github.com/albertnis/mqcontrol/releases). That project also has a special requirement in that there are multiple runtime base images depending on what commands mqcontrol will run. That makes it a perfect candidate for a separate build output stage.

Additionally, I've made a minimal repository for the examples above. Find it at [albertnis/demo-three-stage-dockerfile][]. Check out the [actions][] which automate [releases][] and [packages][] all using the one core Dockerfile for building.

[mqcontrol]: https://github.com/albertnis/mqcontrol
[albertnis/demo-three-stage-dockerfile]: https://github.com/albertnis/demo-three-stage-dockerfile
[actions]: https://github.com/albertnis/demo-three-stage-dockerfile/actions
[releases]: https://github.com/albertnis/demo-three-stage-dockerfile/releases
[packages]: https://github.com/albertnis/demo-three-stage-dockerfile/packages
[multi-stage-dockerfile]: https://docs.docker.com/develop/develop-images/multistage-build/
