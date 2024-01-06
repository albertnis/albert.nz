const nPerRing = 14
const radii = [36, 36, 45, 52, 30]
const r = 4
const rotateDegrees = 75
const ringSpacing = 36
const padding = 20

const squishFactor = Math.cos((rotateDegrees * 2 * Math.PI) / 360)
const viewWidth = (Math.max(...radii) + r) * 2 + padding * 2
const viewX = -viewWidth / 2
const viewHeight =
	radii[radii.length - 1] * squishFactor * 2 +
	ringSpacing * (radii.length - 1) +
	r * 4 +
	padding * 2
const viewY = -radii[0] * squishFactor - r * 2 - padding

let output = `<svg viewBox="${viewX} ${viewY} ${viewWidth} ${viewHeight.toFixed(
	3
)}" width="${viewWidth}" height="${viewHeight.toFixed(3)}">`
for (let i = 0; i < radii.length; i++) {
	const d = radii[i]
	const z = i * ringSpacing
	for (let j = 0; j < nPerRing; j++) {
		const t = (j / nPerRing) * 2 * Math.PI
		const cx = d * Math.cos(t)
		const cy = d * Math.sin(t) * squishFactor + z

		let opacity = 0.5
		if (t <= Math.PI) {
			opacity = 1
		}

		let color = 'currentColor'
		if (i === 3 && j === 3) {
			color = '#f97316'
		} else if ((i === 2 && (j === 3 || j === 2)) || (i === 3 && j === 2)) {
			color = '#8b5cf6'
		}

		output += `<circle cx="${cx.toFixed(3)}" cy="${cy.toFixed(
			3
		)}" opacity="${opacity}" fill="${color}" r="${r}" />`
	}
}
output += '</svg>'

console.log(output)
