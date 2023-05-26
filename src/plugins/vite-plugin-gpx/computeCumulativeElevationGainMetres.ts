import type { Position } from 'geojson'

export const computeCumulativeElevationGainMetres =
	(samplingRate: number) =>
	(elevations: number[]): number => {
		let vertGain = 0
		const gainThreshold = 2
		let currentBaseline = elevations[0]

		for (let i = 0; i < elevations.length; i += samplingRate) {
			const alt = elevations[i]
			const climb = alt - currentBaseline

			if (climb >= gainThreshold) {
				// We have gone up an appreciable amount
				currentBaseline = alt
				vertGain += climb
			} else if (climb <= -gainThreshold) {
				// We have gone down an appreciable amount
				currentBaseline = alt
			}
		}

		return vertGain
	}
