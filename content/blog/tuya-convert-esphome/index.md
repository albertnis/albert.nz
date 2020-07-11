---
title: Upgrading branded IoT devices with tuya-convert and ESPHome
description: Or how my Kogan smart switch wirelessly gained superpowers
date: 2020-07-10 19:17:25 +1200
accent: rgb(243, 53, 53)
links:
  - <a href="https://github.com/albertnis/demo-three-stage-dockerfile">GitHub</a>
---

A couple of weeks ago I was given a Kogan smart plug. This controls a wall outlet over WiFi and measures power draw. It's a feature set similar to the [Sonoff Pow R2][pow-r2] which I'm currently using to control my PC. But it has a couple of notable benefits over the Pow R2

- It is sold officially in New Zealand
- It requires no mains wiring

The Kogan smart plug is manufactured by Tuya, a company making IoT devices on behalf of many brand names around the world. Thanks to a security vulnerability in Tuya devices, they're known for being easy to reflash over-the-air with a tool called [tuya-convert][]. If you've read many of my previous posts, you may be aware that [I like ESPHome](/esphome-button-xiaomi-zigbee/) and that [I don't like brands telling me what to do](/smart-home-architecture/).

With that in mind, I set out to install ESPHome on my Kogan smart plug.

> This could totally brick your device. Follow these steps at your own risk!

# Flashing the plug

Getting ESPHome flashed was actually quite easy and just a matter of following instructions on the relevant guides.

## 1. Build an ESPHome binary

Before flashing, we need a flashable binary file for the device. For ESPHome, this means creating an entity and compiling a binary. To do this I mostly just followed the [official guide](https://esphome-configs.io/guides/tuya-convert/#esphome) so read that for more details. But the process for me boiled down to this:

1.  Go to ESPHome dashboard
1.  Create a really basic config with OTA enabled. (This is so that there's enough information to build a firmware file and enable updating. The actual device configuration will be fleshed out later.)
1.  Compile
1.  Download binary

## 2. Flash it

I used tuya-convert in Docker on a Linux laptop for this process. For this you'll want to follow the [tuya-convert Docker guide](https://github.com/ct-Open-Source/tuya-convert#using-docker). Here's a summary:

1.  Clone the [tuya-convert][] repo
1.  Copy your ESPHome binary to the `files` directory. (You'll need to do this before the Docker build as for some reason the binaries are copied to the image rather than mounted by default.)
1.  Build the image

    ```shell
    docker build -t tuya .
    ```

1.  Copy the docker-compose template

    ```shell
    cp docker/docker-compose-sample.yml docker-compose.yml
    ```

1.  Open the Docker Compose file and ensure the `WLAN` environment variable is the same as the one on your PC. (`ip link` will show all interfaces).

1.  At this stage I had to manually disconnect my laptop from my home WiFi network.

1.  Follow the instructions to run tuya-convert.

    ```shell
    docker-compose up -d
    docker-compose exec tuya start
    ```

1.  Remaining instructions will be displayed in the command line

# Getting it working with the new firmware

At this stage the Kogan plug has been flashed with a minimal ESPHome install. The good news is that it's free from the manufacturer's firmware! But unfortunately the minimal firmware has no actual functionality so the device won't actually

[pow-r2]: https://www.itead.cc/sonoff-pow-r2.html
[tuya-convert]: https://github.com/ct-Open-Source/tuya-convert
