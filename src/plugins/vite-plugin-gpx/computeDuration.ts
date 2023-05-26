import type { Feature } from 'geojson'
import { intervalToDuration, parseISO } from 'date-fns'

/**
 * Calculate the duration from the `coordTime`s stored in a feature's property
 * @param input Feature to use for calculating duration
 * @returns Duration between first and last `coordTime` in the feature
 */
export const computeDuration = (input: Feature): Duration | null => {
	const times = input.properties?.coordTimes
	if (times == null || !Array.isArray(times)) {
		return null
	}

	const start = parseISO(times[0])
	const end = parseISO(times[times.length - 1])

	return intervalToDuration({ start, end })
}
