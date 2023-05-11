---
title: Building a Vite GPX plugin for my blog
date: 2023-05-11T11:54:00+1200
description: How I enabled importing GPX files for interactive maps and more
accent: rgb(90, 85, 255)
tags: [technology]
---

# Extracting data from the GPX file

## Path data

## Elevation data

# Computing metadata

## Distance

## Elevation gain

## Time

There are two key times to capture from an activity: duration and start time.

Start time is easy. Most of the time the GeoJSON feature will contain a "time" which can be used. Just in case, I fall back to the first coordinate time.

```ts
import { parseISO } from 'date-fns'

/**
 * Calculate the start time from a feature
 * @param input Feature to use for calculating start time
 * @returns Date object representing the feature's `time` property, or the first `coordTime` if there is no such property
 */
const computeStartTime = (input: Feature): Date | null => {
	const startTime = input.properties?.time

	if (typeof startTime === 'string') {
		return parseISO(startTime)
	}

	const times = input.properties?.coordTimes

	if (Array.isArray(times)) {
		return parseISO(times[0])
	}

	return null
}
```

Elapsed duration can be calculated by taking the difference between the first and last coordinate time. The `date-fns` library has some very helpful methods and types to assist with this.

```ts
import { intervalToDuration, parseISO } from 'date-fns'

/**
 * Calculate the duration from the `coordTime`s stored in a feature's property
 * @param input Feature to use for calculating duration
 * @returns Duration between first and last `coordTime` in the feature
 */
const computeDuration = (input: Feature): Duration | null => {
	const times = input.properties?.coordTimes
	if (times == null || !Array.isArray(times)) {
		return null
	}

	const start = parseISO(times[0])
	const end = parseISO(times[times.length - 1])

	return intervalToDuration({ start, end })
}
```

## Breaks

Many of the trips I track are multi-day hikes (or "tramps" as they're lovingly known by New Zealanders). It is nice to know where the huts and campsites were along the route. Manually entering the locations of these spots is probably the most foolproof way of doing this, but I opted for an alternative, lazy, method. I simply extract the locations where there are no GPX entries for over four hours. This tends to be a good indicator of where I paused my tracking device overnight--and a great proxy for hut and campsite locations.

```ts
import { differenceInHours, parseISO } from 'date-fns'

/**
 * Compute the locations of breaks exceeding four hours within a feature
 * @param input Feature with coordTimes data used to evaluate breaks
 * @returns Array of indexes where each index corresponds to a coordinate after which there were no coordinates recorded for at least four hours
 */
const computeBreakIndices = (input: Feature): number[] => {
	// Self-contained sampling rate to accelerate calcs
	// Can ususally set this high unless there are lots of stops
	const samplingRate = 30

	const times = input.properties?.coordTimes

	if (!Array.isArray(times)) {
		return []
	}

	// Get the date objects for a subsampled set of timestamps
	const parsedTimes = times.filter((_, i) => i % samplingRate === 0).map((t) => parseISO(t))

	const indices = []
	for (let i = 1; i < parsedTimes.length; i++) {
		if (differenceInHours(parsedTimes[i], parsedTimes[i - 1]) > 4) {
			indices.push((i - 1) * samplingRate)
		}
	}
	return indices
}
```

# Enabling downloading of the original file

# Displaying data

Now that all the data and metadata has been computed, it's time to put this to use! We can simply import data from a GPX file as follows:

```js
import geoData from '../top-hope-hut/Top_Hope_Hope_Kiwi_.gpx'
```

Inspecting or logging `geoData` shows that has the following value:

```js
{
	"elevationData": {
		"downSampledElevations": [
			602,
			602,
			602,
			603 // ... [907 items total]
		],
		"elevationGainMetres": 1073,
		"samplingPeriod": 54
	},
	"metadata": {
		"gpxFilePath": "/@gpx/Top_Hope_Hope_Kiwi_.gpx",
		"breakIndices": [23940, 34560],
		"duration": {
			"years": 0,
			"months": 0,
			"days": 2,
			"hours": 3,
			"minutes": 21,
			"seconds": 45
		},
		"startTime": "2022-09-23T21:34:06.000Z",
		"distanceMetres": 57605.837060918944
	},
	"pathData": {
		"geoJson": {
			"type": "FeatureCollection",
			"features": [
				{
					"type": "Feature",
					"properties": {},
					"geometry": {
						"type": "LineString",
						"coordinates": [
							[172.382772, -42.584167],
							[172.38245, -42.58434],
							[172.382203, -42.584338],
							[172.381928, -42.584328],
							[172.381573, -42.584365] // ... [1958 items total]
						]
					}
				}
			]
		},
		"cumulativeDistancesMetres": [
			0,
			36.508624548783956,
			61.228052816957145,
			88.76666712805523,
			124.48251406266579 // ... [1958 items total]
		],
		"samplingPeriod": 25
	}
}
```

We can see all the geo information is stored there as we expect! Elevation data has a sparser sampling rate than point data and both sampling rates are present. Plus, the object gives us a `gpxFilePath` which can be used to download the original file. Here the file starts with `/@gpx/` because the example output is from a local server.

Displaying the file is now a matter of writing some code that takes this data and renders something with it. It could be plain old JavaScript, a React component, or just about anything. For my Sveltekit blog, I created a `<MapGroup>` Svelte component that renders an elevation graph using SVG and a map using MapBox. I can use the component with the following code snippet:

```svelte
<script>
	import MapGroup from '$lib/components/MapGroup.svelte'
	import geoData from '../top-hope-hut/Top_Hope_Hope_Kiwi_.gpx'
</script>

<figure>
	<MapGroup geo={geoData} />
	<figcaption>Example of GPX-derived data being loaded via map component</figcaption>
</figure>
```

Because my blog is using MDsveX to render Markdown, I can even use this exact code inline within this very blog post. Here's the output:

<script>
  import MapGroup from '$lib/components/MapGroup.svelte'
  import geoData from '../top-hope-hut/Top_Hope_Hope_Kiwi_.gpx'
  console.log(geoData)
</script>
<figure>
  <MapGroup geo={geoData} />
  <figcaption>Example of GPX-derived data being loaded via map component</figcaption>
</figure>

## Graceful degradation in the absence of JavaScript
