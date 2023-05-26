import { describe, it, expect } from 'vitest'
import { downSampleArray } from './downSampleArray'

describe('when period is an integer greater than or equal to 1', () => {
	const period = 3

	it('returns a downsampled array', () => {
		const output = downSampleArray([1, 2, 3, 4, 5], period)
		expect(output).toEqual([1, 4])
	})
})

describe('when period is 1', () => {
	const period = 1

	it('returns values matching input array', () => {
		const output = downSampleArray([1, 2, 3], period)
		expect(output).toEqual([1, 2, 3])
	})

	it('returns a copy of the input array, not a reference to the input array', () => {
		const input = [1, 2, 3]
		const output = downSampleArray(input, period)
		expect(output).not.toBe(input)
	})
})

describe('when period is not an integer', () => {
	const period = 1.5

	it('throws an exception', () => {
		const call = () => downSampleArray([1, 2, 3], period)
		expect(call).toThrowError(TypeError)
		expect(call).toThrowError('Period must be an integer greater than or equal to 1')
	})
})

describe('when period is less than 1', () => {
	const periods = [-3, -4.5, 0.9, 0]

	it.each(periods)('throws an exception (period=%i)', (period) => {
		const call = () => downSampleArray([1, 2, 3], period)
		expect(call).toThrowError(TypeError)
		expect(call).toThrowError('Period must be an integer greater than or equal to 1')
	})
})
