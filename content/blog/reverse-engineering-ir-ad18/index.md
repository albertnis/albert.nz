---
title: Understanding Infrared Remote Control
date: 2019-05-11T21:23:25+1300
description: Going beyond the remote in pursuit of automation
accent: rgb(24, 170, 132)
tags: [technology]
---

![Broadlink RM3 Mini3][rm3]

The humble Wi-Fi IR blaster is a powerful tool in home automation. Suddenly any device with a traditional remote control can be commanded over the air. With my [Broadlink RM Mini 3][rm3-store] and its [Home Assistant Component][bl-ha], all I need to do is tell Home Assistant to send a packet to the blaster and it will do the job! I want to answer a couple of questions here:

- What is a packet, anyway?
- What packet do I send?

These are questions I only recently answered for myself by [reverse-engineering a heatpump remote][ar-ry13]. In this post I'll use simpler examples to explain the basics.

## What is a packet, anyway?

To understand packets, we need to understand how IR remotes work. When you press a button on a remote, a message is broadcast as precisely-timed pulses of infrared light which are emitted from the LED and picked up by the receiver. There can be hundreds of pulses in a single IR message - easy to take for granted when you just want to turn your TV on!

A packet is simply data sent to a WiFi blaster which contains all this timing information so that it can broadcast the IR message just as a remote would. It's basically an encoded form of the IR message. What the packet looks like can depend on the IR blaster being used.

### Time domain: raw pulses

Let's look more closely at how IR pulses work.

The pulses adhere to a **carrier frequency** where the LED will turn on or off for a certain number of carrier frequency cycles in succession. The frequency is typically around 40kHz, but just like most things in the world of IR, the carrier frequency varies between manufacturers and devices. There's really no standardisation here!

Here is an imaginary sequence of six remote pulses at a carrier frequency of 20kHz. We can think of the pulses as a series of 12 alternating on/off durations (each pulse consists of on time, then off time). Read the table left-to-right to get an idea of different ways of looking at the time-domain information. Notice how the pulse durations change between pulses.

| Pulse      | 1   |     | 2   |     | 3   |     | 4   |     | 5   |     | 6   |     |
| ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IR state   | On  | Off | On  | Off | On  | Off | On  | Off | On  | Off | On  | Off |
| Cycles (n) | 70  | 130 | 16  | 16  | 30  | 16  | 16  | 16  | 16  | 16  | 70  | 110 |
| Time (ms)  | 3.5 | 6.5 | 0.8 | 0.8 | 1.5 | 0.8 | 0.8 | 0.8 | 0.8 | 0.8 | 3.5 | 5.5 |

This is the kind of timing information that can be encoded into a packet for sending to an IR blaster. Note that in the real world, messages are considerably longer than this.

### Data domain: beyond the pulses

The pulses aren't just random, of course. They encode a data payload which can be picked up by the receiving device. For simple remotes this data is typically some kind of key code, which can be parsed at the receiving end. On more complex remotes such as heatpump remotes, they can consist of state data and even have checksums!

Let consider the example from the before. Another way of writing the cycles is with [n-on, n-off] notation, like this:

```
[70, 130], [16, 16], [30, 16], [16, 16], [16, 16], [70, 110]
```

These pairs are called **burst pairs**. Grouping pulses into burst pairs makes outliers clearer. The long pulses and the beginning and end of the message stand out here. They are probably the **leader** and **trailer**, respectively. Such pulses are used to serve as a kind of "marker" for the receiver. But they typically don't encode data. As we're trying to extract data, let's remove them, leaving the following:

```
[16, 16], [30, 16], [16, 16], [16, 16]
```

When we get to a stage of having two types of burst pair, we're in a good spot. This means we can extract binary from the pairs. Typically the pairs with a proportionally longer "on" duration mean a `1` and the other pairs mean `0`. In our case some pairs have a 30-cycle "on" duration and some have a 16-cycle "on" duration. Let's replace the 30-cycle pairs with `1` and the others with `0`:

```
0100
```

So our remote data is `0b0100`. Or, in other words, the number `4`. If that seems like quite a lot of pulse information for one nibble of data, that's because it is! But we need to retain all this timing information in order to faithfully rebroadcast the signal from the IR blaster and have it received properly.

### Encoding pulses as packets

Say we want to send this timing data to an IR blaster as packet. What do we send? Pulses are truly just a series of durations, but we can't simply use the table or array notations I've used for demonstration. We need a more useful, standardised format. Two encodings I'm familiar with are Pronto and Broadlink.

#### Pronto codes

Pronto are used by Pronto-branded IR blasters and are also a generally accepted IR code format. Do a web search for "pronto codes" and you'll find a ton for your device. Pronto codes are hexadecimal and consist of a "preamble" which declares carrier frequency and message length, followed by the burst pairs defined as cycle counts. Here's what our previous example looks like as a Pronto code packet, with some extra annotation added beneath.

```
0000 00cf 0006 0000 0046 0082 0010 0010 001e 0010 0010 0010 0010 0010 0046 006e
     freq  len      leader    bit 1     bit 2     bit 3     bit 4     trailer
preamble --->       burst pairs --->
```

There's much more information about this popular format at [Remote Central][pronto-info].

#### Broadlink codes

Broadlink devices like my IR blasters use their own code format. Broadlink codes are basically burst-pair information converted from cycles to multiples of a certain time period. This is surrounded by a Broadlink preamble and postamble, then converted to base64 encoding before sending to the device (which I'm doing via Home Assistant). Here's our (rather ugly) Broadlink code packet.

```
JgAOAHLVGhoxGhoaGhpytA0FAAAAAAAAAAAAAA==
```

Check out my [pronto2broadlink][p2b] script for conversion from Pronto to Broadlink format. A good write-up of the Broadlink format is [here][bl-info].

## What packet do I send?

The previous example is all well and good, but it assumes we know what timing data we need to send to the blaster. Unless we already have a Pronto code or similar, it's unlikely we know what to send. There are three main ways I have successfully obtained codes for devices.

### Learning mode

Most, if not all, IR blasters come with a learn mode. In this mode, the blaster operates "in reverse" and receives signals from remotes. For example, you could enter learn mode, press the power button on your TV remote, and then receive the resulting packet back from the blaster. Sending this packet to the blaster in the future will broadcast that message to toggle the TV power. The best part? Since learning happens on your blaster, you know that it will give you the correct packet format for use in the future - so there's no need for conversion or inspection of the packet.

### Find it online

Searching for IR codes online can be surprisingly fruitful. Some manufacturers publish [entire spreadsheets][pioneer] of Pronto codes. These documents often contain "secret" codes not found on the remote. [Discrete IR codes][discrete] are a great example; these codes are perfect for home automation as they remove some state-management burden. IR code databases are also present. As with Broadlink blasters, you may need to convert the Pronto codes to vendor-specific packet formats.

### Reverse-engineering

For complex remotes, reverse-engineering can work. This is the wild west of IR codes. The approach basically consists of analysing a remote, extracting transmitted data for various keypresses and then attempting to work out how data payloads are structured and what they mean. The data can then be changed and reconstructed into artificially-created packets. I recently did this successfully with a [heatpump][ar-ry13] (one for a future post). Here's an example of a less successful effort, with my SMSL AD18 amplifier. In this case, each key transmitted a data payload of one byte:

| Function     | Data (hex) | Data (dec) | Data/15 (dec) |
| ------------ | ---------- | ---------- | ------------- |
| Toggle power | 87         | 135        | 9             |
| Mute         | 96         | 150        | 10            |
| Center       | 2d         | 45         | 3             |
| Up           | 4b         | 75         | 5             |
| Down         | 69         | 105        | 7             |
| Left         | c3         | 195        | 13            |
| Right        | a5         | 165        | 11            |
| Next input   | e1         | 225        | 15            |
| Fn           | 1e         | 30         | 2             |

I noticed that all payload values were multiples of 15, and that 9 multiples of 15 were missing! Did that mean 9 "secret" commands were present which could include discrete power commands? In this case, no. I tried broadcasting the other multiple of 15 and nothing happened. You win some, you lose some.

## Summary

The humble IR remote is a powerful tool and, thanks to IR blasters, is one that can be integrated into a home automation system effectively. It's been fascinating to learn about how the IR messaging works and the encodings people use to store and share codes. I have found that reverse-engineering remote controls can be a surprisingly engaging challenge - a challenge which is extra rewarding when it works. At \$25 for one of these little blasters, it's hard not to recommend getting one!

[rm3]: ./rm3.jpg
[rm3-store]: https://www.aliexpress.com/item/Broadlink-RM-Mini-3-mini3-WIFI-IR-Remote-Control-For-Smart-Home-Automation-by-APP-For/32907686132.html
[bl-ha]: https://www.home-assistant.io/components/broadlink/
[ar-ry13]: https://github.com/albertnis/fujitsu-ar-ry13-ir-codes
[pronto-info]: http://www.remotecentral.com/features/irdisp1.htm
[p2b]: https://github.com/albertnis/fujitsu-ar-ry13-ir-codes/blob/master/src-js/pronto2broadlink.js
[bl-info]: https://github.com/mjg59/python-broadlink/blob/master/protocol.md#sending-data
[pioneer]: https://www.google.com/search?client=ubuntu&channel=fs&q=pioneer+ir+codes+xls&ie=utf-8&oe=utf-8
[discrete]: https://www.engadget.com/2009/02/05/hd-101-discrete-ir-codes/
