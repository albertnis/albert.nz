/**
 * Downsample an array by skipping over values
 * @param input Array of values at high sample rate
 * @param period Proportion of values to keep. e.g. 1 will take every value, 3 will take every third
 * @returns Array of values at low sample rate
 */
export const downSampleArray = <T>(input: T[], period: number): T[] => {
	if (period < 1 || period % 1 != 0) {
		throw new TypeError('Period must be an integer greater than or equal to 1')
	}

	if (period === 1) {
		// Return a copy of input
		return [...input]
	}

	const output: T[] = []

	for (let i = 0; i < input.length; i += period) {
		output.push(input[i])
	}

	return output
}
