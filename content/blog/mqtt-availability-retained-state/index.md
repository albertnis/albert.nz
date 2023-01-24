---
title: Using MQTT for Availability and Retained State
date: 2019-01-04T12:23:25+1300
accent: rgb(173, 56, 121)
---

One of the crucial aspects of MQTT is the broker. Among other things, the broker manages connected clients, ensuring messages are received from and sent to the correct devices. The broker doesn't simply forward messages, however. It can also respond to devices being connected and disconnected - an immensely useful feature. I recently updated [lightt][] to leverage two MQTT features:

- **Last Will and Testament (LWT)** for availability updates
- **Retained messages** for persistent state

Here's an explanation of what I did to get these features working for me, with some examples from Home Assistant and mosquitto. If you want to try out the examples, install [mosquitto][mosquitto-install].

## Last Will and Testament (LWT)

Binary devices have two basic states, **on** or **off**:

![Home Assistant light on][capture_on]
![Home Assistant light off][capture_off]

There is a third state, even for binary devices, which is very useful: **unavailable**:

![Home Assistant light unavailable][capture_unavailable]

An unavailable state allows home automation software to prevent commands being sent to a disconnected device. It is also useful for monitoring the health of devices, or as a failsafe. For instance, if an alarm system is powered down, other devices can be alerted to this fact. Google Assistant will also mention if devices are unavailable.

But how can a device tell other devices when it is disconnected? This is where the power of the broker and [LWT][lwt] comes in. When a device connects to a broker, it can specify an LWT topic and payload. The broker receives this information and will publish it when that device is disconnected. Essentially, the device says _"I'd like to connect. When I eventually disconnect, publish this message"_. The broker takes on the responsibility and publishes the LWT payload on the device's behalf when it becomes disconnected.

Let's give this a go in Arduino C++ using [PubSubClient][pubsubclient]:

```cpp
// Connect to the broker and tell it to publish "offline" to the availability topic when disconnected in the future
char availabilityTopic[] = "light/desktop/availability";
bool mqttConnected = client.connect(
    mqttClientname,
    mqttUser,
    mqttPassword,
    availabilityTopic,
    0,
    1,
    "offline");

if (mqttConnected) {
    client.subscribe(commandTopic, 1);

    // Publish "online" to the availability topic now to signify connection
    client.publish(availabilityTopic, "online", true);

    Serial.println("connected");
  }
```

You can play around with this by using mosquitto_sub to investigate messages. Run mosquitto_sub then turn the device on and off. You should see something like this:

```shell
$ mosquitto_sub -t "light/desktop/availability" -v -h localhost
light/desktop/availability online
light/desktop/availability offline
```

The "offline" message is received like magic _after_ the device loses power! The broker has delivered the last will and testament of the client.

Home Assistant can be set up to use this topic. By default, it expects "online" and "offline" as payloads on the availability topic. Here is an example [mqtt_template][] light entry in `configuration.yaml`:

```yaml
light:
  - platform: mqtt_template
    name: "Desktop light"
    state_topic: "light/desktop/state"
    command_topic: "light/desktop/command"
    availability_topic: "light/desktop/availability"
    ...
```

## Retained Messages

When a device powers up, what state should it be in? Let's take a light for example. An easy option would be to have the light turn on to the same colour each time. Or maybe have the light remain off ("black") to make restarts inconspicuous. The best option is to have the light retain its previous state. There are two main ways to do that:

1. The light remembers its own last state, perhaps by writing every change to persistent storage and reading this storage on boot.
1. The light gets its previous command from the broker and executes that command to restore state.

Both approaches have their merits, but I like the second option because it ensures all parts of our setup are working from the ground truth provided by the broker.

MQTT has a feature just for this - [retained messages][retain]. Any message can be sent as a retained message. This message will be sent to future subscribers to the topic _as soon as they subscribe_. Only the latest retained message for that topic will be sent. Let's see it in action using mosquitto_sub and mosquitto_pub.

```shell
$ mosquitto_sub -t "light/test" -v -h localhost

```

Nothing to see here! No messages are being published to this channel so the output is empty. Kill this command and we can do some publishing:

```shell
$ mosquitto_pub -t "light/test" -h localhost -m "retained!" -r
$ mosquitto_pub -t "light/test" -h localhost -m "not retained"
```

We sent two messages to the test topic, with a key difference: the `-r` flag in the first command means this message is retained and will be sent to new subscribers. We can check this by subscribing again:

```shell
$ mosquitto_sub -t "light/test" -v -h localhost
light/test retained!
```

This is excellent and can work both ways in home automation:

- If the device publishes state updates as retained, the home automation software will receive state on connection to the broker.
- If the home automation software publishes commands as retained, the device will receive commands on connection, hopefully restoring state.

On the device in Arduino C++, this is simple and looks like this:

```cpp
// The "true" means retain in PubSubClient
client.publish(stateTopic, output, true);
```

In Home Assistant, it is also simple:

```yaml
light:
  - platform: mqtt_template
    name: "Desktop light"
    command_topic: "light/desktop/command"
    retain: true
    ...
```

## Summary

Leveraging the LWT and retain features of MQTT has made me realise just how useful MQTT can be. These features facilitate convenient use cases in home automation software. Previously I thought MQTT's broker seemed like a redundant middleman. Now it is clear just how powerful this architecture is for transparently managing subscribers and their payloads.

[lightt]: https://github.com/albertnis/lightt
[mosquitto-install]: https://mosquitto.org/download/
[lwt]: https://www.hivemq.com/blog/mqtt-essentials-part-9-last-will-and-testament/
[retain]: https://www.hivemq.com/blog/mqtt-essentials-part-8-retained-messages/
[capture_on]: ./capture_on.png
[capture_off]: ./capture_off.png
[capture_unavailable]: ./capture_unavailable.png
[pubsubclient]: https://github.com/knolleary/pubsubclient
[mqtt_template]: https://www.home-assistant.io/components/light.mqtt/#template-schema
