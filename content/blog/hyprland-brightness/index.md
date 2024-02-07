---
title: Extending brightness controls to external monitors, in 15 lines of code
description: Harnessing Hyprland to brighten/dim whichever monitor I'm working on
date: 2023-09-14T21:47:25+1200
tags: [technology]
---

I change the brightness quite often on my displays, trying to keep it as dim as possible for my environment as it changes throughout the day. For external displays, I fiddle with the monitor's physical buttons and on-screen display to dial in the brightness; for the built-in display I use the brightness buttons on the keyboard. That's how it's meant to work, right?

I have been using the impressive [Hyprland][] compositor on my Linux laptop for the last month or so, and it occurred to me recently that I had all the ingredients for a better setup: a setup where the laptop's brightness keys would just change the brightness of whichever monitor I was using in that moment.

## The ingredients

To change the brightness of the internal display, I use [brillo][] because it supports smoothed brightness adjustments. This is the command I previously had bound to the brightness up key in Hyprland's config:

```bash
# Increase the brightness 8% over 150ms
brillo -u 150000 -A 8
```

To increase the brightness of the external display, [ddcutil][] is perfect as it uses DDC/CI to change the display's paramters over I²C (magic!):

```bash
# Increase the brightness of the first external monitor by 8%
ddcutil --display=1 setvcp 10 + 8
```

What I really wanted to do was run the relevant command for the currently focused monitor (ie, the one where the cursor is). Here's where Hyprland comes in:

```bash
# Get a list of monitors including focused state and ID, in JSON format
hyprctl monitors -j
```

The (truncated) output of this command is:

```js
[
	{
		"id": 0,
		"name": "eDP-1", // The internal monitor
		"focused": false,
		...
	},
	{
		"id": 1,
		"name": "DP-2", // My one external monitor
		"focused": true,
        ...
	}
]
```

Using a bit of `jq`, I plucked out the ID and name of the focused monitor:

```bash
focused_name=$(hyprctl monitors -j | jq -r '.[] | select(.focused == true) | .name')
focused_id=$(hyprctl monitors -j | jq -r '.[] | select(.focused == true) | .id')
```

## Putting it together

Now it's just a matter of getting the current monitor and running the correct command based on its name:

```bash
#!/usr/bin/env sh

# Accept an arg '+' or '-'
direction=$1

# Get monitor info
monitor_data=$(hyprctl monitors -j)
focused_name=$(echo $monitor_data | jq -r '.[] | select(.focused == true) | .name')

if [ "$focused_name" == "eDP-1" ]; then
    # Internal display is focused -> use brillo
    if [ "$direction" == "-" ]; then
        brillo -u 150000 -U 8
    else
        brillo -u 150000 -A 8
    fi
else
    # External display is focused -> use ddcutil
    # But *which* external display?
    focused_id=$(echo $monitor_data | jq -r '.[] | select(.focused == true) | .id')
    ddcutil --display=$focused_id setvcp 10 $direction 8
fi
```

I named this script `hypr_brightness.sh` and mapped it to my brightness keys in my `hyprland.conf` a bit like the following:

```conf
binde = , XF86MonBrightnessDown, exec, /path/to/hypr_brightness.sh -
binde = , XF86MonBrightnessUp, exec, /path/to/hypr_brightness.sh +
```

Since implementing this change on my personal device, I've found myself confused on other laptops when the external monitor brightness does not change when I use the brightness keys. That's just how intuitive it feels.

You can find the script at [albertnis/hypr-brightness](https://github.com/albertnis/hypr-brightness) on GitHub. The version there is a bit more refined, with argument validation and some optimisations.

[ddcutil]: https://github.com/rockowitz/ddcutil
[Hyprland]: https://hyprland.org/
[brillo]: https://gitlab.com/cameronnemo/brillo
