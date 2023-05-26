import { it, expect } from 'vitest'
import { haversineDistanceMetres } from './haversineDistanceMetres'

it('is close enough', () => {
	const output = haversineDistanceMetres([-42.41086, 171.56052], [-42.25001, 171.50817])

	expect(Math.floor(output)).toEqual(18_396)
})
