/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				rubik: ['Rubik', 'sans-serif']
			},
			gridTemplateColumns: {
				'layout-lg':
					'[full-start] 1fr [image-start wide-start] 5rem [prose-start] 750px [prose-end] 5rem [image-end wide-end] 1fr [full-end]',
				'layout-sm':
					'[full-start image-start] 1rem [wide-start prose-start] 1fr [prose-end wide-end] 1rem [full-end image-end]'
			},
			screens: {
				lgxl: '1140px'
			},
			typography: {
				quoteless: {
					css: {
						'blockquote p:first-of-type::before': { content: 'none' },
						'blockquote p:first-of-type::after': { content: 'none' }
					}
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
}
