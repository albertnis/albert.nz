---
title: How to Reverse Engineer a Heat Pump Unit
date: 2019-06-15T11:09:20+1200
description: Cracking the code and paving the way to automation
accent: rgb(170, 35, 170)
---

![](./DSC06428.jpg)

Recently, I learnt about some of the [basics of IR communication][ir-article]. These fundamentals are interesting, but I wanted to apply them to a real-world situation: automating my heat pump. The aim was to be able to set the heat pump to any setting using Home Automation software and an IR blaster, without the heat pump's own remote control. Here's how I did it - hopefully the steps are helpful for anybody else looking to get into heat pump automation.

> There are various encodings of IR payloads below. It gets a bit technical and I'll be switching between pronto and Broadlink notation without much explanation. If you're new to this I highly recommend checking out the [article on the basics][ir-article] before proceeding.

# Research

Before diving blindly into the project, I did some digging. First of all, I found the model of my remote: in this case, a Fujitsu AR-RY13. Like most heat pump or A/C remotes, the state of the heat pump is managed on the remote. That means that when you, say, change the temperature on the remote, an IR code will be emitted which includes the remote's entire state, including things like swing mode, fan speed, and operation mode. There are some codes - like the power off code - which are _stateless_ and don't change based on heat pump state.

In researching similar remotes online, I came across a [useful document][fujitsu-reverse] put together by David Abrams on Remote Central. It contains details of the IR protocol used in Fujitsu's AR-RY16 remote. The model name sounded similar to my AR-RY13 so I used this document as a starting point, assuming the two protocols would be identical or similar.

# Reverse-engineer protocol

There are two things that need to be reverse engineered here:

- **Timing of the remote codes**: How bits of data are converted into IR pulses.
- **Construction of the data packets**: How heat pump states are converted in bits of data.

I tackled timing of the remote codes first because it will let us try out some basic stateless codes without worrying about constructing state packets.

## Timing of remote codes

The off code is an example of a stateless code which can be sent to the heat pump. Using the Broadlink RM Mini 3's learning capability, I captured the off packet of my remote control. It looks like this:

```
JgB2AG4zDwsQCxAmDwwPJhALEAsPDA8mECYQCw8MDwsQJhAmDwsQCxALEAsPDA8MDwsQCxALEAsPDA8LEAsQJg8MDwsQCxALEAsPDA8LECYQCxALDwwPCxAmEAsPDA8LEAsQCxALDyYQCxAmECYPJhAmDyYQJhAADQUAAA==
```

That's the base64 representation which is used by Broadlink devices. Decoding it reveals the following byte array:

```
[26, 00, 76, 00, 6e, 33, 0f, 0b, 10, 0b, 10, 26, 0f, 0c, 0f, 26, 10, 0b, 10, 0b, 0f, 0c, 0f, 26, 10, 26, 10, 0b, 0f, 0c, 0f, 0b, 10, 26, 10, 26, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 0f, 0c, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 0f, 0b, 10, 0b, 10, 26, 0f, 0c, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 0f, 0b, 10, 26, 10, 0b, 10, 0b, 0f, 0c, 0f, 0b, 10, 26, 10, 0b, 0f, 0c, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 26, 10, 0b, 10, 26, 10, 26, 0f, 26, 10, 26, 0f, 26, 10, 26, 10, 00, 0d, 05, 00, 00]
```

In Broadlink protocol, most of these numbers represent timings in multiples of 2^-15s (the first few and last few are a [bit different][bl-protocol]). I know that this code, when sent to the heat pump, will turn it off. The trick now is to try to derive this same code from the information in David Abrams' document. Then I will know that I have worked out the timing information for the heat pump and can send any bits to the heat pump. The document says this is the code:

```
00101000110001100000000000001000000010000100000010111111
```

That's a series of bits which need to be converted to a code. The document says that "one" bits become `0010 0010` and "zero" bits become `0010 002e`. Those are _pronto codes_ which means each hex value is a number of cycles. I added the leader and trailer specified in the document then converted this to a Broadlink code by using the frequency 39kHz, close to the 38kHz specified by Abrams. I chose this because the resulting code had the "26" values which I saw in the real packet. This is a good indicator that the frequency is close. Here's what this generated value looks like, with the real bytes (from before) alongside:

```
Real:      [26, 00, 76, 00, 6e, 33, 0f, 0b, 10, 0b, 10, 26, 0f, 0c, 0f, 26, 10, 0b, 10, 0b, 0f, 0c, 0f, 26, 10, 26, 10, 0b, 0f, 0c, 0f, 0b, 10, 26, 10, 26, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 0f, 0c, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 0f, 0b, 10, 0b, 10, 26, 0f, 0c, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 0f, 0b, 10, 26, 10, 0b, 10, 0b, 0f, 0c, 0f, 0b, 10, 26, 10, 0b, 0f, 0c, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 26, 10, 0b, 10, 26, 10, 26, 0f, 26, 10, 26, 0f, 26, 10, 26, 10, 00, 0d, 05, 00, 00]
Generated: [26, 00, 76, 00, 68, 34, 0d, 26, 0d, 26, 0d, 0d, 0d, 26, 0d, 0d, 0d, 26, 0d, 26, 0d, 26, 0d, 0d, 0d, 0d, 0d, 26, 0d, 26, 0d, 26, 0d, 0d, 0d, 0d, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 0d, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 0d, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 0d, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 0d, 0d, 26, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, ff, 0d, 05, 00, 00]
```

The good news is that the length is perfect! We're clearly on to something here. In our generated code the "one" bits have become burst pairs of `[0d, 0d]` and the "zero" bits are `[0d, 26]`. But notice how they don't line up very well: our first `[0d, 26]` lines up with a `[0f, 0b]` in the real code and our first `[0d, 0d]` lines up with a `[10, 26]`. It appears our bit mappings are reversed! Looks like this remote is a bit different to the AR-RY16 that Abrams documented.

I performed the same generation as before, but this time "one" bits become `0010 002e` and "zero" bits become `0010 0010` - opposite to before. I left the trailer and leader the same.

```
Real:             [26, 00, 76, 00, 6e, 33, 0f, 0b, 10, 0b, 10, 26, 0f, 0c, 0f, 26, 10, 0b, 10, 0b, 0f, 0c, 0f, 26, 10, 26, 10, 0b, 0f, 0c, 0f, 0b, 10, 26, 10, 26, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 0f, 0c, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 0f, 0b, 10, 0b, 10, 26, 0f, 0c, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 0f, 0b, 10, 26, 10, 0b, 10, 0b, 0f, 0c, 0f, 0b, 10, 26, 10, 0b, 0f, 0c, 0f, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 26, 10, 0b, 10, 26, 10, 26, 0f, 26, 10, 26, 0f, 26, 10, 26, 10, 00, 0d, 05, 00, 00]
Generated + flip: [26, 00, 76, 00, 68, 34, 0d, 0d, 0d, 0d, 0d, 26, 0d, 0d, 0d, 26, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 26, 0d, 26, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 26, 0d, 26, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 26, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 26, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 26, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 0d, 26, 0d, 0d, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, 26, 0d, ff, 0d, 05, 00, 00]
```

Looks much better! Note how the first `[0d, 0d]` lines up with a `[0f, 0b]`. The real code has a bit of jitter so this is a match as far as I'm concerned. One thing I'm not too sure about is the `ff` which appears in the generated code near the end. Luckily, it doesn't seem to affect things. This code, when sent to the blaster, is recognised by the heat pump as an off code.

> I leant on Abrams' work to validate this step of the reverse-engineering process. If you don't have such a document, this is still totally doable! You'll just have to start with the intial captured packet and derive bits directly from that packet. Play around with frequency ranges and bit mappings to get a feel for what will or won't work on your heat pump.

## Construction of the data packets

Having worked out timing information, we can move on to look at data. Abrams' document says the heat pump broadcasts its entire state in 16 bytes of information. Let's capture a code and take a look. This is a code for 30 degrees Celsius, heat mode, no fan, no swing, with the heat pump already on:

```
JgAGAXAyEAsQCxAlEAsQJhAKEQoQCxAmECUQCxALEAsQJRElEAsPDBAKEAsRChALEAsQChEKEQoQCxALEAsPJhALEAsPDBAKEQoQCxALECYQChEKEAsQCxAlESUQJhAlECYQJhAlECYQCxAKESUQCxALEAoQCxALDwwQCxAKESUQJhALEAoQCxALEAsQCw8MECUQJhAlEQoQCxAmEAoRChALDwwQCxAKEAwPJhALDwwQChEKEAsQCw8MEAoRChALEAsQCxAKEQoQCxALEAsQCxAKEQoQCxALEAsQChEKEAsQCxALEAoRChEKEAsQCxALECUQCw8MDwwQChALECYQCxAKESUQJhAADQUAAA==
```

Decoded into timing bytes, we get this:

```
[26, 00, 06, 01, 70, 32, 10, 0b, 10, 0b, 10, 25, 10, 0b, 10, 26, 10, 0a, 11, 0a, 10, 0b, 10, 26, 10, 25, 10, 0b, 10, 0b, 10, 0b, 10, 25, 11, 25, 10, 0b, 0f, 0c, 10, 0a, 10, 0b, 11, 0a, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 0f, 26, 10, 0b, 10, 0b, 0f, 0c, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 26, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 25, 11, 25, 10, 26, 10, 25, 10, 26, 10, 26, 10, 25, 10, 26, 10, 0b, 10, 0a, 11, 25, 10, 0b, 10, 0b, 10, 0a, 10, 0b, 10, 0b, 0f, 0c, 10, 0b, 10, 0a, 11, 25, 10, 26, 10, 0b, 10, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 10, 25, 10, 26, 10, 25, 11, 0a, 10, 0b, 10, 26, 10, 0a, 11, 0a, 10, 0b, 0f, 0c, 10, 0b, 10, 0a, 10, 0c, 0f, 26, 10, 0b, 0f, 0c, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 0f, 0c, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 25, 10, 0b, 0f, 0c, 0f, 0c, 10, 0a, 10, 0b, 10, 26, 10, 0b, 10, 0a, 11, 25, 10, 26, 10, 00, 0d, 05, 00, 00]
```

We can remove the Broadlink preamble and postamble, as well as the leader and trailer pair to give us this:

```
[10, 0b, 10, 0b, 10, 25, 10, 0b, 10, 26, 10, 0a, 11, 0a, 10, 0b, 10, 26, 10, 25, 10, 0b, 10, 0b, 10, 0b, 10, 25, 11, 25, 10, 0b, 0f, 0c, 10, 0a, 10, 0b, 11, 0a, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 0f, 26, 10, 0b, 10, 0b, 0f, 0c, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 26, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 25, 11, 25, 10, 26, 10, 25, 10, 26, 10, 26, 10, 25, 10, 26, 10, 0b, 10, 0a, 11, 25, 10, 0b, 10, 0b, 10, 0a, 10, 0b, 10, 0b, 0f, 0c, 10, 0b, 10, 0a, 11, 25, 10, 26, 10, 0b, 10, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0b, 0f, 0c, 10, 25, 10, 26, 10, 25, 11, 0a, 10, 0b, 10, 26, 10, 0a, 11, 0a, 10, 0b, 0f, 0c, 10, 0b, 10, 0a, 10, 0c, 0f, 26, 10, 0b, 0f, 0c, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 0f, 0c, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 0a, 11, 0a, 11, 0a, 10, 0b, 10, 0b, 10, 0b, 10, 25, 10, 0b, 0f, 0c, 0f, 0c, 10, 0a, 10, 0b, 10, 26, 10, 0b, 10, 0a, 11, 25, 10, 26]
```

That's 256 timing entries in the array, or 128 burst pairs. Each pair is a bit - meaning we have 16 bytes right here, as predicted by Abrams' document. Maybe this won't be so hard after all. Using the timing knowledge gleaned earlier, we can go through and replace each pair with a bit. We can't just do a find and replace. This is due to the jitter I mentioned earlier: "One" bits aren't always `[0d, 26]` - sometimes they are `[10, 25]` or `[0f, 26]`. We can look at proportions instead. Here's the kind of substitution rule which works: Each pair where the second item is at least 1.5 times the first item encodes a "one" bit. Otherwise we take the pair as encoding a "zero" bit. Applying this rule for each pair of timing values, the code becomes:

```
00101000110001100000000000001000000010000111111110010000000011000000011100100000001000000000000000000000000000000000010000010011
```

Or, in hex:

```
[28, c6, 00, 08, 08, 7f, 90, 0c, 07, 20, 20, 00, 00, 00, 04, 13]
```

Boom! We have ourselves a state payload. Are all these hex codes getting confusing? Remember that we are now in the data domain. These bytes represent encoded state _data_, not _timing_. We just made an algorithm to convert a captured IR packet to a data payload. Let's apply the algorithm to an IR code for 18 degrees celsius instead of 30 with all other settings equal. Can you spot the difference?

```
30deg: [28, c6, 00, 08, 08, 7f, 90, 0c, 07, 20, 20, 00, 00, 00, 04, 13]
18deg: [28, c6, 00, 08, 08, 7f, 90, 0c, 04, 20, 20, 00, 00, 00, 04, 11]
                                         ^                           ^
```

Now we know that the second nibble of the ninth byte determines temperature, with `7` meaning 30°C and `4` meaning 18°C.

We are now in a position to reverse engineer the remainder of the state payload. I did this by changing one thing on the remote at a time and running a script to extract the state payload. By seeing what changes in the payload, I was able to map out what each byte means in the payload. I put the results on [Github][github]. Interestingly, the bytes are generally different to Abrams' document but have the same position.

### Checksum

The final byte of the payload is the checksum. If it's not correct then the heat pump will ignore the entire packet, presumably because it assumes interference. Abrams gives a simple way to calculate the checksum but it didn't work for the AR-RY13. I found a more complex algorithm [online][checksum] and played around with different ranges of bytes to checksum until the generated code matched real-world examples. The final algorithm is something like this:

1. Reverse each of bytes 9 - 15. e.g. 11100001 -> 10000111 (0xe1 -> 0x87) for a single byte
1. Sum those reversed bytes
1. Take result of (208 - sum) % 256
1. Reverse bytes of result

> Determining checksums may take a wee bit of trial and error. You'll most likely need to generate some packets to test, as below.

# Generating packets

We have fully reverse engineered the AR-RY13 protocol at this stage. We know how the remote encodes bits as timings, plus how to get a 16 byte code from the heat pump state. At this stage we can write code to generate IR codes given a heat pump state, in the following steps:

1. Receive a desired heat pump state from a user.
1. Generate the corresponding 16-bit state payload, including checksum. Or just use a stateless "off code" if the heat pump is turning off.
1. Convert to timing information using bit mapping and frequency. This includes appending trailer and prepending leader.
1. Convert to desired format (e.g. Broadlink).
1. Send to IR blaster.
1. Profit!

# What now?

In the [next article][automate-article] I'll go into how we can wrap this workflow in an automation pipeline using Node-RED for intuitive control through Home Assistant.

[ir-article]: /reverse-engineering-ir-ad18
[automate-article]: /automating-ac
[fujitsu-reverse]: http://files.remotecentral.com/library/21-1/fujitsu/air_conditioner/index.html
[github]: https://github.com/albertnis/fujitsu-ar-ry13-ir-codes
[checksum]: https://stackoverflow.com/a/48533869
[bl-protocol]: https://github.com/mjg59/python-broadlink/blob/master/protocol.md#sending-data
