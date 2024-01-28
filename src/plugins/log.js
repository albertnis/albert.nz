import { inspect } from 'util'

export const log = () => {
	return function transformer(tree) {
		console.log('=====LOG=====\n', inspect(tree, { showHidden: false, depth: null, colors: true }))
	}
}
