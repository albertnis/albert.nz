import { describe, it, expect } from 'vitest'
import { computeCumulativeElevationGainMetres } from './computeCumulativeElevationGainMetres'

describe('when there is no vertical gain', () => {
	describe('because the elevation is monotonically descending', () => {
		const input = [50, 49, 48, 47, 46, 45, 43]

		it('returns 0', () => {
			const output = computeCumulativeElevationGainMetres(1)(input)
			expect(output).toEqual(0)
		})
	})

	describe('because the elevation has only small gains despite undulating', () => {
		const input = [50, 51, 50, 49, 50, 45]

		it('returns 0', () => {
			const output = computeCumulativeElevationGainMetres(1)(input)
			expect(output).toEqual(0)
		})
	})

	describe('because the sampling rate will cause it to be missed', () => {
		const input = [50, 100, 50, 49, 48, 47, 46]
		const samplingRate = 2

		it('returns 0', () => {
			const output = computeCumulativeElevationGainMetres(samplingRate)(input)
			expect(output).toEqual(0)
		})
	})
})

describe('when there is vertical gain', () => {
	describe('e.g. the elevation steadily increases by 10', () => {
		const input = [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]

		it('returns 10', () => {
			const output = computeCumulativeElevationGainMetres(1)(input)
			expect(output).toEqual(10)
		})
	})

	describe('e.g. the elevation has one sudden increase of 20', () => {
		const input = [40, 60, 49, 48, 47, 48, 47]

		it('returns 20', () => {
			const output = computeCumulativeElevationGainMetres(1)(input)
			expect(output).toEqual(20)
		})
	})
})
