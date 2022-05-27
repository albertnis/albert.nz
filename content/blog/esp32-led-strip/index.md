---
title: A High-Quality LED Strip with ESPHome and the ElectroDragon Control Board
date: 2022-05-26T14:11:00+1200
description: Learnings in ESP32-C3 and high-quality COB LEDs
accent: rgb(80, 70, 250)
---

```yaml
esphome:
  name: ceiling_light
  platformio_options:
    board_build.flash_mode: dio

esp32:
  board: esp32-c3-devkitm-1
  variant: esp32c3
  framework:
    type: esp-idf
    version: latest

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: 'Ceiling Light Fallback Hotspot'
    password: !secret wifi_ap_password

logger:

api:

ota:

light:
  - platform: cwww
    name: 'Ceiling light'
    cold_white: redpin
    warm_white: greenpin
    cold_white_color_temperature: 6000 K
    warm_white_color_temperature: 2700 K
    constant_brightness: true

output:
  - platform: ledc
    pin: GPIO5
    id: redpin
    frequency: 19531Hz
  - platform: ledc
    pin: GPIO8
    id: greenpin
    frequency: 19531Hz
  # - platform: ledc
  #   pin: GPIO10
  #   id: bluepin
  #   frequency: 19531Hz
  # - platform: ledc
  #   pin: GPIO9
  #   id: whitepin
  #   frequency: 19531Hz
```

There are some important bits in here:

`board_build.flash_mode: dio` is absolutely required for flashing to work successfully. Without this line, the board will default to QIO mode which resulted in boot loops on my ESP32-C3 board.

`frequency: 19531Hz` is taken from the table of [recommended frequencies published in the ESPHome documentation](https://esphome.io/components/output/ledc.html#recommended-frequencies). Initially I tried 1220Hz as this results in the most steps available for buttery transitions. Unfortunately, my power supply produced a loud whining sound and some flickering at that frequency. So I switched to the lowest recommended frequency above my hearing limit of about 18kHz; 19.5kHz it was! It's a bit disappointing to lose some bit depth but worth it for the reduced flickering and noise -- besides, I don't notice a different in transitions. A lower recommended frequency may work well for you if you have a better quality supply.

![][board]

<figcaption></figcaption>

![][strip]

<figcaption></figcaption>

![][curtain]

<figcaption></figcaption>

[board]: ./PXL_20220525_034245456.jpg

[strip] ./PXL_20220525_212245352.jpg
[curtain]: ./PXL_20220526_045405691.MP.jpg
