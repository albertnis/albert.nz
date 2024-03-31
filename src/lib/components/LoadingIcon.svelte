<svg viewBox="-10 -10 20 20" class="icon">
	<circle cx="0" cy="0" r="8" />
</svg>

<style>
	.icon {
		display: inline;
		stroke: currentColor;
		fill: none;
		stroke-width: 3;
		height: 1em;
		stroke-dasharray: 38, 12.2656;
		stroke-dashoffset: 45;
		animation:
			spinning 1s linear 0s infinite reverse,
			vibing 2s ease-in-out 0s infinite alternate;
		animation-fill-mode: forwards;
	}

	@keyframes spinning {
		0% {
			stroke-dashoffset: 0;
		}

		100% {
			stroke-dashoffset: 50.2656;
		}
	}

	@keyframes vibing {
		0% {
			stroke-dasharray: 20, 30.2656;
		}

		100% {
			stroke-dasharray: 45.2656, 5;
		}
	}
</style>
