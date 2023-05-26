import { describe, it, expect } from 'vitest'
import { computeBreakIndices } from './computeBreakIndices'
import type { Feature } from 'geojson'

describe('when the input feature has coordinate times', () => {
	const input: Partial<Feature> = {
		properties: {
			coordTimes: [
				'2023-02-23T00:00:00Z',
				'2023-02-23T03:59:59Z', // + 03:59:59
				'2023-02-23T04:00:01Z', // + 00:00:02
				'2023-02-23T12:00:01Z', // + 04:00:00
				'2023-02-24T12:00:01Z' // + 24:00:00
			]
		}
	}

	describe('when every timestamp is sampled', () => {
		const samplingRate = 1

		it('returns indices corresponding to breaks of at least four hours', () => {
			const output = computeBreakIndices(samplingRate)(input as Feature)
			expect(output).toEqual([2, 3])
		})
	})

	describe('when every second timestamp is sampled', () => {
		const samplingRate = 2

		it('returns different set of correct break indices reflecting sampling limits', () => {
			const output = computeBreakIndices(samplingRate)(input as Feature)
			expect(output).toEqual([0, 2])
		})
	})
})

describe('when the input feature has no coordinate times', () => {
	const input: Partial<Feature> = {
		properties: {}
	}

	it('returns an empty array', () => {
		const output = computeBreakIndices(1)(input as Feature)
		expect(output).toEqual([])
	})
})
