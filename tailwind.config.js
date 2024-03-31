/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter', 'San Francisco', 'Arial', 'system-ui', 'sans-serif']
			},
			gridTemplateColumns: {
				'layout-md':
					'[full-start] 1fr 1rem [image-start wide-start] minmax(0, 5rem) [prose-start] calc(768px - 2rem) [prose-end] minmax(0, 5rem) [image-end wide-end] 1rem 1fr [full-end]',
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
