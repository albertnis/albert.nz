---
title: A High-Quality LED Strip with ESPHome and ESP32-C3
date: 2022-05-26T14:11:00+1200
description: Combining the new ElectroDragon control board with COB LEDs
accent: rgb(80, 70, 250)
---

It's been a while since I've played around with LED strips. A while ago I set up some RGBW LED strips with the ESP8266-based ElectroDragon LED strip control board. These have been running reliably on the WLED firmware for years. WLED and ESP8266 are perfect for individually-addressable LED strips like the SK6812 ones I have. Recently I noticed ElectroDragon is now selling an ESP32-based version of the driver board. The ESP32 has the notable benefit of hardware PWM--perfect for high-quality white LED strips!

# Hardware

# The LED strip

I'm using a 24V two-channel white COB LED strip. I went with this strip for a few reasons:

- This is for ceiling lighting; I don't need colour and I don't need individually-addressable LEDs.
- I enjoy the idea of having controllable colour temperature so I can change it during the day or connect it to Flux.
- The CRI of these strips is excellent at >90. The white channel of a SK6812 strip is generally rated at >70. This all means the COB strip gives off a much fuller-feeling light that is more suitable to illuminate a room.
- 24V means I can run over two metres of the strip without having to wire up extra power lines to intermediate points along the strip (something I had to do with my 5V addressable strips).
- The COB design of this particular strip is incredibly bright at over 700 lumens per metre.
- With an insane 640 LEDs per metre, the strip basically has all the diffusion it needs built right in. This is less of a concern given I will be bouncing the light off the ceiling.

![][strip]

<figcaption>The LEDs on the strip are inside that yellow stripe along the middle. You can see the solder pads for cold white and warm white channels, plus the common 24V anode attached to the red wire. The strip came with a four-pin connector with three wires. I got so confused about how the wires connected to the pins that I desoldered the factory connector and used these much more sensible three-wire JST connectors I had floating around.</figcaption>

You'll need a 24V power supply to use with these. I bought a cheap supply from BTF Lighting, the same seller as the LED strip. I would recommend a more reputable 24V supply, perhaps one of those more traditional "plastic brick" style ones.

# The driver

I have loved working with ElectroDragon's ESP8266 boards in previous projects. It's a basic LED strip controller with built-in MOSFETs and voltage regulation--configurable to drive addressable LED strips like the SK6812 or "direct" LED strips by sending PWM signals to the MOSFET pins.

I was overjoyed to see they released an upgraded version based on the ESP32. A big downside of the ESP8266 is its lack of hardware PWM. This means the "direct drive" LED strips like the one I'm using in this project is more likely to flicker as the microcontroller juggles PWM signalling, WiFi connection, and other tasks with competing priorities. That's simply not an issue with the much more powerful ESP32. PWM is managed using what are called LEDC channels. Just specify a PWM frequency and it will be taken care of in hardware. At 7USD a pop, more people should know about these delightful boards.

To configure the boards hardware in this project, I set both power jumpers to the "5-27V" setting. This means that I can use the 24V power supply required for the strip as input and power will be passed straight through. At the output side, I set the jumpers to R (as opposed to GND) and G (as opposed to IO2). This is the configuration for driving those "direct" LED strips via the MOSFETs.

![][board]

<figcaption>The ElectroDragon ESP LED strip control board alongside my USB FTDI adatper</figcaption>

The board comes with screw terminals for the power connections. I was happy to see that unlike previous revisions, the power input terminals are labelled on the silkscreen. Like on my other projects with the board, once I was happy with my configuration, I soldered the input wires, output wires and jumper settings in place.

# Software

ESPHome is my go-to for this kind of project. The end result I want is a temperature-controllable light entity in Home Assistant. Fortunately, ESPHome has the `cwww` light platform which is exactly for this application. The `ledc` output component lets me use that glorious hardware PWM, too.

The configuration I went with looks something like this:

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
    cold_white: greenpin
    warm_white: redpin
    cold_white_color_temperature: 6000 K
    warm_white_color_temperature: 2700 K
    constant_brightness: true

output:
  - platform: ledc
    pin: GPIO5
    id: greenpin
    frequency: 19531Hz
  - platform: ledc
    pin: GPIO8
    id: redpin
    frequency: 19531Hz
  # - platform: ledc
  #   pin: GPIO12
  #   id: bluepin
  #   frequency: 19531Hz
  # - platform: ledc
  #   pin: GPIO14
  #   id: whitepin
  #   frequency: 19531Hz
```

There are some important bits in here:

- `board: esp32-c3-devkitm-1` signifies that this is isn't an ESP32 but rather the related-by-name ESP32-C3. The ESP32-C3 is less powerful but contains many of the ESP32's key features. It's also much newer than the ESP32 and runs on the completely different RISC-V architecture. ESPHome support appears to still be in development but this config worked well enough, after a lot of trial and error!
- `board_build.flash_mode: dio` is absolutely required for flashing to work successfully. Without this line, the board will default to QIO mode which resulted in boot loops on my ESP32-C3 board.
- `frequency: 19531Hz` is taken from the table of [recommended frequencies published in the ESPHome documentation](https://esphome.io/components/output/ledc.html#recommended-frequencies). Initially I tried 1220Hz as this results in the most steps available for buttery transitions. Unfortunately, my power supply produced a loud whining sound and some flickering at that frequency. So I switched to the lowest recommended frequency above my hearing limit of about 18kHz; 19.5kHz it was! It's a bit disappointing to lose some bit depth but worth it for the reduced flickering and noise -- besides, I don't notice a different in transitions. A lower recommended frequency may work well for you if you have a better quality supply.

## A note on pins

I've included the other pins on the board, commented out, for reference purposes. This took some sleuthing as ElectroDragon doesn't even publish the pin numbers for the ESP32 variant of this board. Here's a table of what I found:

| Output channel               | Pin (ESP8266 variant) | Pin (ESP32-C3 variant) |
| ---------------------------- | --------------------- | ---------------------- |
| G                            | GPIO13                | GPIO5                  |
| R                            | GPIO15                | GPIO8                  |
| B\*                          | GPIO12                | GPIO4                  |
| W\*                          | GPIO14                | GPIO3                  |
| Signal (SK6812 or similar)\* | GPIO2                 | GPIO10                 |

> \* I haven't actually tested these ones. But comparing the pinouts of the ESP-12F and ESP-C3-12F modules, I think these are the mappings that make sense.

## Flashing the board

I used the ESPHome dashboard interface to enter and export the config. From the dashboard, find the device you're flashing and select Install -> Manual download -> Modern format. It should compile and download a `bin` file which can be flashed to the ESP. The documentation for "Modern format" is entirely absent but after much pain and learning about bootloaders I can confirm this is the option you want (I believe "modern" generates an image including the bootloader, which makes it really simple to flash to the `0x0` offset).

Connect the ESP board to a USB FTDI adapter. My FTDI adapter is based on the CP2102 and includes a 3.3V output. Connect GND -> GND, RX -> TX, TX -> RX and 3V3 -> 3V3.

I flashed the board on Linux using esptool.

> Before each `esptool` command, hold down the `IO0` button on the ESP board while plugging the FTDI adapter into the computer. The signals the ESP to boot in flash mode.

First, erase the contents of the flash:

```shell
python -m esptool -p /dev/ttyUSB0 -b 460800 --before default_reset --after hard_reset --chip esp32c3 erase_flash
```

Now flash the firmware:

```shell
python -m esptool -p /dev/ttyUSB0 -b 460800 --before default_reset --after hard_reset --chip esp32c3 write_flash 0x0 firmware-factory.bin
```

Easy as! The device should eventually appear as online in the ESPHome dashboard. Over-the-air flashing will be possible now.

> For troubleshooting, I found picocom a useful tool to monitor serial output over USB:
>
> ```shell
> picocom -b 115200 /dev/ttyUSB0
> ```

# The result

It's simple, and it works. Introducing my new ceiling light! I'm really impressed by the quality of the light. While it's fun being able to generate rainbows from lights like the SK6812, there's something really beautiful about a natural, bright, high-CRI white. I'll be sticking to this kind of strip whenever I just want illumanation, not decoration, from a lighting project.

![][curtain]

<figcaption></figcaption>

[strip]: ./PXL_20220525_212245352.jpg
[board]: ./PXL_20220525_034245456.jpg
[curtain]: ./PXL_20220526_045405691.MP.jpg
