import { describe, it, expect } from 'vitest'
import { gpxDataToOutput } from '.'
import type { ViteGpxPluginOutput } from './types'
import { parseISO } from 'date-fns'

describe('when processing a small but valid GPX file', () => {
	const gpxFileContents = `
	<?xml version="1.0" encoding="UTF-8"?>
	<gpx creator="albertnis" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
		<metadata>
		<time>2021-04-03T01:05:41Z</time>
		</metadata>
		<trk>
		<name>Test track</name>
		<type>4</type>
		<trkseg>
			<trkpt lat="-40.6400460" lon="175.3448410">
			<ele>32.0</ele>
			<time>2021-04-03T01:09:41Z</time>
			<extensions>
				<gpxtpx:TrackPointExtension>
				<gpxtpx:hr>99</gpxtpx:hr>
				</gpxtpx:TrackPointExtension>
			</extensions>
			</trkpt>
			<trkpt lat="-40.6600460" lon="175.3648410">
			<ele>132.0</ele>
			<time>2021-04-04T01:05:42Z</time>
			<extensions>
				<gpxtpx:TrackPointExtension>
				<gpxtpx:hr>99</gpxtpx:hr>
				</gpxtpx:TrackPointExtension>
			</extensions>
			</trkpt>
			<trkpt lat="-40.6600460" lon="175.3648410">
			<ele>132.0</ele>
			<time>2021-04-04T01:05:43Z</time>
			<extensions>
				<gpxtpx:TrackPointExtension>
				<gpxtpx:hr>99</gpxtpx:hr>
				</gpxtpx:TrackPointExtension>
			</extensions>
			</trkpt>
			<trkpt lat="-40.6600460" lon="175.3648410">
			<ele>132.0</ele>
			<time>2021-04-04T01:05:44Z</time>
			<extensions>
				<gpxtpx:TrackPointExtension>
				<gpxtpx:hr>100</gpxtpx:hr>
				</gpxtpx:TrackPointExtension>
				</extensions>
			</trkpt>
		</trkseg>
		</trk>
	</gpx>
	`.trim()

	it('returns sensible output', () => {
		const output = gpxDataToOutput(gpxFileContents, '/test-track.gpx')
		expect(output).toEqual<ViteGpxPluginOutput>({
			elevationData: {
				downSampledElevations: [32, 132, 132, 132],
				elevationGainMetres: 100,
				samplingPeriod: 1
			},
			metadata: {
				breakIndices: [],
				distanceMetres: 2825.9158471434926,
				duration: {
					years: 0,
					months: 0,
					days: 0,
					hours: 23,
					minutes: 56,
					seconds: 3
				},
				gpxFilePath: '/test-track.gpx',
				startTime: parseISO('2021-04-03T01:09:41Z')
			},
			pathData: {
				cumulativeDistancesMetres: [0, 2825.9158471434926, 2825.9158471434926, 2825.9158471434926],
				geoJson: {
					coordinates: [
						[175.344841, -40.640046],
						[175.364841, -40.660046],
						[175.364841, -40.660046],
						[175.364841, -40.660046]
					],
					type: 'LineString'
				},
				samplingPeriod: 1
			}
		})
	})
})
