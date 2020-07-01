---
title: Remote controlling a computer using MQTT
date: 2020-04-21T17:59:12+1200
description: Developing a simple Go application to solve a problem
accent: rgb(144, 81, 237)
links:
  - <a href="https://github.com/albertnis/mqcontrol">Github</a>
---

As part of my home automation system, I like to be able to shutdown my computer remotely. This way I can safely shutdown the computer before powering it off at the wall.

The challenge is: how do I make the computer respond to the message and instigate a shutdown?

This is not a new challenge, and there are personal-project utilities all over the place which achieve the goal. Previously I was doing this with software called MqttClient, a .NET GUI which ran on Windows. Now that I'm splitting my time between multiple operating systems, I wanted a small, cross-platform utility which could run quietly in the background and subscribe to shutdown requests.

Introducing: **mqcontrol**

mqcontrol is yet another MQTT remote control utility. It's small, cross-platform, CLI-only and availble as a [Docker image][mqcontrol-dockerhub]. The source is available on [GitHub][mqcontrol-github].

# How I'm using mqcontrol

## Remote hibernate as part of "safe off" script

I'm using mqcontrol as part of a computer shutdown script. When I activate the script, Home Assistant does the following:

1. Send the command to hibernate the computer
1. Wait for the computer power draw to drop below 20W
1. Switch off the computer at the wall after a delay

Here's a basic version of what that script looks like in Home Assistant YAML configuration:

```yaml
computer_off_safe:
  alias: Turn computer off safely
  sequence:
    - service: mqtt.publish
      data:
        topic: "flat/abedroom/pc/hibernate"
        payload: ""
    - wait_template: "{{ states('sensor.computer_power')|int < 20 }}"
      timeout: "00:02:00"
      continue_on_timeout: "false"
    - delay:
        seconds: 2
  - service: switch.turn_off
    data:
      entity_id: switch.computer_plug
```

mqcontrol runs on the computer and listens for the hibernate command.

On Linux I use systemd to run the following command at boot:

```bash
mqcontrol -c "systemctl hibernate" -t flat/abedroom/pc/hibernate
```

On Windows I use task scheduler to run an analogous command on login:

```bash
mqcontrol.exe -c "shutdown /h /t 0" -t flat/abedroom/pc/hibernate
```

This way it doesn't matter which OS I'm booted into; the command will always cause a hibernate.

##

# Learnings

For a small one-weekend project, I managed to learn a ton while developing mqcontrol. I'll be writing more about these for sure!

- Basics of Golang and its tooling.
- Docker [BuildKit][buildkit] and three-stage Dockerfile to use build stage for both artifact generation and runtime image creation.
- Docker [Buildx][buildx] to build and push cross-platform Docker images - but using Go cross-compilation on the build platform to eliminate the need for expensive emulation.
- [GitHub Actions][actions] and Docker-out-of-Docker for releases based on Git tags and automated CI/CD.

[mqcontrol-github]: https://github.com/albertnis/mqcontrol
[mqcontrol-dockerhub]: https://hub.docker.com/r/albertnis/mqcontrol
[buildkit]: https://docs.docker.com/develop/develop-images/build_enhancements/
[buildx]: https://github.com/docker/buildx
[actions]: https://github.com/features/actions
