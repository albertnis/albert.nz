import { describe, it, expect } from 'vitest'
import { computeStartTime } from './computeStartTime'
import type { Feature } from 'geojson'
import { formatISO } from 'date-fns'

describe('when the input feature contains coordinate times', () => {
	const baseInput: Partial<Feature> = {
		properties: {
			coordTimes: ['2023-02-23T21:34:06Z', '2023-02-24T21:34:06Z']
		}
	}

	describe('and the input feature contains a start time', () => {
		const input: Partial<Feature> = {
			...baseInput,
			properties: {
				...baseInput.properties,
				time: '2023-02-22T13:00:00Z'
			}
		}

		it('returns the start time from the feature', () => {
			const output = computeStartTime(input as Feature)

			expect(output).not.toBeNull()
			expect(output?.getUTCDate()).toEqual(22)
		})
	})

	describe('and the input feature contains no start time', () => {
		const input = baseInput

		it('returns the first coordinate time from the feature', () => {
			const output = computeStartTime(input as Feature)

			expect(output).not.toBeNull()
			expect(output?.getUTCDate()).toEqual(23)
		})
	})
})

describe('when the input feature contains no coordinate times', () => {
	const baseInput: Partial<Feature> = {
		properties: {}
	}

	describe('and the input feature contains a start time', () => {
		const input: Partial<Feature> = {
			...baseInput,
			properties: {
				...baseInput.properties,
				time: '2023-02-22T13:00:00Z'
			}
		}

		it('returns the start time from the feature', () => {
			const output = computeStartTime(input as Feature)

			expect(output).not.toBeNull()
			expect(output?.getUTCDate()).toEqual(22)
		})
	})

	describe('and the input feature contains no start time', () => {
		const input = baseInput

		it('returns null', () => {
			const output = computeStartTime(input as Feature)

			expect(output).toBeNull()
		})
	})
})
