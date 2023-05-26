const RADIUS_OF_EARTH_IN_M = 6371000

const toRadian = (angle: number) => (Math.PI / 180) * angle
const distance = (a: number, b: number) => (Math.PI / 180) * (a - b)

/**
 * Use Haversine algorithm to compute distance between two coordinates
 * @param param0 Array of two numbers representing latitude and longitude of coordinate 1
 * @param param1 Array of two numbers representing latitude and longitude of coordinate 2
 * @returns Distance in metres between coordinate 1 and coordinate 2
 */
export const haversineDistanceMetres = (
	[lat1, lon1]: [number, number],
	[lat2, lon2]: [number, number]
) => {
	const dLat = distance(lat2, lat1)
	const dLon = distance(lon2, lon1)

	lat1 = toRadian(lat1)
	lat2 = toRadian(lat2)

	// Haversine Formula
	const a =
		Math.pow(Math.sin(dLat / 2), 2) +
		Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2)
	const c = 2 * Math.asin(Math.sqrt(a))

	const finalDistance = RADIUS_OF_EARTH_IN_M * c

	return finalDistance
}
