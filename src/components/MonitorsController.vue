<template>
	<div class="monitors">
		<div 
			v-for="(screen, index) in monitors"
			:key="index"
			class="monitor-container"
			:class="{active: screen.isActive}"
			@click="updateScreen(screen)"
			@mousedown="mdown(screen)"
			@mouseenter="menter(screen)">

			<div class="progressbar" v-bind:style="{ width: screen.barPosition + 'px' }"></div>
			<div class="monitor-name">{{ screen.name ? screen.name : `Monitor ${index + 1}` }}</div>
			<div class="pourcentage">{{Math.round(screen.pourc)}}</div>
		</div>

	</div>
</template>

<script>
export default {
  name: 'MonitorsController',
	data() {
		return {
			mouse: {
				x: 0,
				y: 0,
			},
			win: {
				w: window.innerWidth,
				h: window.innerHeight,
				deadMargin: 12,
			},
			monitors: [
				{ id: 1, pourc: 0, barPosition: 0, name: '', isActive: false },
				{ id: 2, pourc: 0, barPosition: 0, isActive: false },
				{ id: 3, pourc: 0, barPosition: 0, isActive: false },
			],
			showDebug: true,
		}
	},
	methods: {
		mdown(screen) {
			screen.isActive = true
			this.updateScreen(screen)
		},
		mup() {
			this.monitors.forEach((screen) => (screen.isActive = false))
		},
		menter(screen) {
			if (this.isSomeoneActive) {
				screen.isActive = true
			}
		},
		mmove(event) {
			this.mouse.x = event.clientX
			this.mouse.y = event.clientY
			if (this.isSomeoneActive) {
				this.monitors.forEach((screen) => this.updateScreen(screen))
			}
		},
		updateScreen(screen) {
			if (screen.isActive) {
				screen.pourc = this.xRelative
				screen.barPosition = this.xRelative <= 0 ? 0 : this.xRelative >= 100 ? this.win.w : this.mouse.x
			}
		},
		close() {
			window.unlighter.close()
		},
		round(number, precision) {
			const factor = Math.pow(10, precision)
			return Math.round(number * factor) / factor
		}
	},
	computed: {
		xRelative() {
			const intervalLength = this.win.w - 2 * this.win.deadMargin
			const factor = intervalLength / 100
			const position = Math.min(Math.max(this.win.deadMargin, this.mouse.x), this.win.w - this.win.deadMargin)
			return this.round((position - this.win.deadMargin) / factor, 2)
		},
		isSomeoneActive() {
			return this.monitors.some((screen) => screen.isActive)
		},
		howManyActives() {
			return this.monitors.reduce((acc, curr) => acc + (curr.isActive ? 1 : 0), 0)
		},
	},
	mounted() {
		window.addEventListener("mouseup", () => {
			this.mup()
		})
		window.addEventListener("mousemove", (event) => {
			this.mmove(event)
		})
	}
}
</script>

<style lang="sass" scoped>

.monitors
	display: flex
	flex-direction: column
	gap: 4px
	.monitor-container
		position: relative
		display: flex
		justify-content: space-between
		align-items: center
		padding: 0 30px
		height: 80px
		font-weight: 500
		cursor: url('./../assets/cursor_hover.svg') 13.5 6, pointer
		background-color: rgba(255,255,255,0.02)
		.progressbar
			position: absolute
			top: 0
			bottom: 0
			left: 0
			width: 0%
			background-color: rgba(255,255,255,0.10)
		&.active
			.progressbar
				border-right: 2px solid white

</style>