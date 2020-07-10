---
title: Liberating branded IoT devices with tuya-convert and ESPHome
description: No wires, no problem
date: 2020-07-10 19:17:25 +1200
accent: rgb(243, 53, 53)
links:
  - <a href="https://github.com/albertnis/demo-three-stage-dockerfile">GitHub</a>
---

1. Build an ESPHome binary https://esphome-configs.io/guides/tuya-convert/

   1. Add vanilla config
   1. Compile
   1. Download binary

1. Prepare ESPHome Docker https://github.com/ct-Open-Source/tuya-convert#using-docker

   1. Clone
   1. Copy ESPHome binary
   1. Build
   1. Modify WLAN env var (`ip link`)

1. Follow instructions
