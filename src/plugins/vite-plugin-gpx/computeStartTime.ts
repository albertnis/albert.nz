import type { Feature } from 'geojson'
import { parseISO } from 'date-fns'

/**
 * Calculate the start time from a feature
 * @param input Feature to use for calculating start time
 * @returns Date object representing the feature's `time` property, or the first `coordTime` if there is no such property
 */
export const computeStartTime = (input: Feature): Date | null => {
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
