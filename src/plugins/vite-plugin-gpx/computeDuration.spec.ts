import { describe, it, expect } from 'vitest'
import { computeDuration } from './computeDuration'
import type { Feature } from 'geojson'

describe('when the input feature contains coordinate times', () => {
	const input: Partial<Feature> = {
		properties: {
			coordTimes: ['2023-02-23T21:34:06Z', '2023-02-24T21:34:06Z', '2023-02-25T21:34:06Z']
		}
	}

	it('returns the duration between the first and last times', () => {
		const output = computeDuration(input as Feature)

		expect(output).toEqual<Duration>({
			years: 0,
			months: 0,
			days: 2,
			hours: 0,
			minutes: 0,
			seconds: 0
		})
	})
})

describe('when the input feature contains no coordinate times', () => {
	const input: Partial<Feature> = {
		properties: {}
	}

	it('returns null', () => {
		const output = computeDuration(input as Feature)

		expect(output).toBeNull()
	})
})
