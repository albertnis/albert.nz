import type { Feature } from 'geojson'
import { differenceInHours, parseISO } from 'date-fns'

/**
 * Compute the locations of breaks exceeding four hours within a feature
 * @param samplingRate Self-contained sampling rate to accelerate calcs. The higher this is, the lower the precision of returned indices. Can ususally set this high (~30) unless there are lots of stops
 * @param input Feature with coordTimes data used to evaluate breaks
 * @returns Array of indexes where each index corresponds to a coordinate after which there were no coordinates recorded for at least four hours
 */
export const computeBreakIndices =
	(samplingRate: number) =>
	(input: Feature): number[] => {
		const times = input.properties?.coordTimes

		if (!Array.isArray(times)) {
			return []
		}

		// Get the date objects for a subsampled set of timestamps
		const parsedTimes = times.filter((_, i) => i % samplingRate === 0).map((t) => parseISO(t))

		const indices = []
		for (let i = 1; i < parsedTimes.length; i++) {
			if (differenceInHours(parsedTimes[i], parsedTimes[i - 1]) >= 4) {
				indices.push((i - 1) * samplingRate)
			}
		}
		return indices
	}
