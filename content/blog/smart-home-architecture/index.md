---
title: Smart home architecture - DIY vs off-the-shelf home automation setup
date: 2020-04-11T12:54:12+1200
description: Why smart homes can be a mess, and why there's a better way
accent: rgb(144, 81, 237)
tags: [technology]
---

Smart home devices are all the rage these days. It's simple to grasp the basic concept of what such devices can do - they enable remote control and automation by connecting to the network, where they can be controlled by a server. There are many ways of building a system to achieve this outcome. I often have trouble explaining to friends what a smart home really _is_, and what it means to build a "DIY" smart home system.

In this post I want to look at two ends of the effort spectrum when it comes to building a smart home system: "off-the-shelf" and "do-it-yourself". I want to show why the low-effort option has some drawbacks, and why building a more customised smart home system yourself can be rewarding if you put in the effort.

# Architecture

Here are what the systems look like. As an example, the smart home has the following devices in both cases:

- A Xiaomi Aqara hub plus two bulbs, temperature sensor and a button
- A Philips Hue gateway with two bulbs, and LED strip and a dimmer switch
- Two Wemo smart plugs and a Wemo light switch

## The "off-the-shelf" smart home

You go to an electronics store and buy the components. After setting things up according the manuals you'll end up with the following:

![Architecture diagram for off-the-shelf smart home][ots-svg]

This is the typical "default" smart home setup. What you'll notice here is that **access to the devices is separated by brand** (represented by blue rectangles). For device setup and control you'll have to use the specific app or website for the device in question.

The only place where all the devices can be controlled together is in Google Assistant or Alexa. This means that to automate devices across brands, you're forced to use the automation functionality inside Google Assistant or Alexa. For example, you might want the Wemo light switch to control the Hue LED strip. This automation functionality is dictated by Google or Amazon; it may or may not be sufficient for your needs.

For devices which do not operate on WiFi, you'll need separate, brand-specific gateways. This can be seen for the Xiaomi and Philips systems. Both ecosystems use Zigbee for communication, but will require different hubs to communicate with the respective servers over the internet.

## The "do-it-yourself" smart home

With a home server and some learning, the system can be built more like the following:

![Architecture diagram for DIY smart home][diy-svg]

Crucially, unlike the off-the-shelf system, **access is controlled by domain** (represented by purple rectangles). This means that the app you open is not determined by _who made the device_; it's determined by _what you want to do_. These domain-specific services each run as a web server, shown by the blue boxes. In my case, these are Docker containers all running on a single server and defined in a single docker-compose file.

- Want to setup, monitor or change the state of devices? Open [Home Assistant](https://www.home-assistant.io/). States are all managed there - with its myriad integrations, it works with almost all major smart home brands.

- Want to integrate custom WiFi devices which don't work out of the box? Use MQTT with [mosquitto](https://mosquitto.org/). Zigbee devices like the Aqara and Hue devices earlier can share a single USB gateway which talks to mosquitto via a service called [zigbee2mqtt](https://www.zigbee2mqtt.io/).

- Want to configure powerful automations within Home Assistant and beyond? [Node-RED](https://nodered.org/) is great for that.

- Want to save time-series data, graph, and query it? [Prometheus](https://www.home-assistant.io/integrations/prometheus/) and [Grafana](https://grafana.com/) are an awesome duo enabling just that!

- Want to use voice to control devices? Google Assistant or Alexa are perfect.

# Comparing the two systems

Advantages of the **off-the-shelf system**:

- Easy setup
- No need for own server

Advantages of the **DIY system**:

- Vendor lock-in is eliminated
- Apps and websites for interacting with the system are separated based on use case ("domain"), not brand
- Individual domains can be built out as desired, not limited by vendor support for various domains
- Support for open source or custom software running on IoT devices
- Data is stored in fewer locations
- Data sent to the internet can be eliminated or controlled
- Can usually be set up to retain access through vendor apps and services if desired

# Why I think the DIY system is worth it

The default smart home setup is exactly what manufacturers want you to have, and it's a mess. Vendor lock-in is my main concern with the smart home industry. If you have some Hue lights and want to buy a switch, you'll avoid a cheap Aqara switch because that would require a second hub - even though both systems use Zigbee and are physically interoperable. You're locked in to the Hue ecosystem and will most likely opt for a Philips device.

In my opinion, the bottom line is this: **as a user, you shouldn't have to care who made your smart home device**. You should be able to pick the best device for your needs and budget and integrate it into the rest of your system. Software like Home Assistant has made this dream realisable with a low barrier to entry.

# What you need to get started

All you need is a home server and some smart home devices! For a server, I'd recommend starting small. An SBC such as Raspberry Pi or Odroid-XU4 is a great choice and lets you get started for under \$100. I'm currently running a second-hand Intel NUC, which is more powerful - also recommended.

In terms of software, my suggestion is Home Assistant. For an SBC you can [download and install Home Assistant as a SD card image][fka-hassio]. If you want a more flexible and modular solution, I would highly recommend using [Docker and docker-compose][ha-docker].

Search for the Home Assistant integrations for your devices and get them set up. That's the basic work done! The next steps are up to you - pick a domain you're interested in, learn about it, and build it yourself.

[fka-hassio]: https://www.home-assistant.io/hassio/
[ha-docker]: https://www.home-assistant.io/docs/installation/docker/
[ots-svg]: ./smart_home_architecture_ots.svg
[diy-svg]: ./smart_home_architecture_diy.svg
