<template>
	<div class="monitors-controller">
		<div 
			v-for="(screen, index) in monitors"
			:key="index"
			class="monitor-container"
			:class="{active: screen.isActive}"
			:style="{'border-width': `0 ${win.borderMargin}px`}"
			@click="updateScreen(screen)"
			@mousedown="mdown(screen)"
			@mouseenter="menter(screen)"
			@mouseleave="mleave(screen)"
		>

			<div class="progressbar" v-bind:style="{ width: screen.barPosition + 'px', left: `-${win.borderMargin}px` }"></div>
			<div class="monitor-name">{{ screen.name ? `${screen.name}` : `Monitor ${index + 1}` }}</div>
			<div class="pourcentage">{{Math.round(screen.str)}}</div>
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
				w: 320,
				h: 400,
				deadMargin: 12,
				borderMargin: 5,
			},
			monitors: [
				{ id: 1, index: 0, str: 0, barPosition: 0, name: 'Loading...', isActive: false },
			],
			showDebug: true,
		}
	},
	methods: {
		init(monitors) {
			this.monitors = monitors.map((monitor, index) => {
				return {
					id: monitor.id,
					index: index,
					str: monitor.str,
					barPosition: this.barPositionFromStr(monitor.str),
					name: monitor.name,
					isActive: false,
				}
			})
		},
		barPositionFromStr(str) {
			const interval = this.win.w - 2 * this.win.deadMargin
			return this.round(interval / 100 * str + this.win.deadMargin, 1)
		},
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
			window.unlighter.sendToMonitors({msg: "index", action: "show", index: screen.index})
		},
		mleave(screen) {
			window.unlighter.sendToMonitors({msg: "index", action: "hide", index: screen.index})
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
				screen.str = this.xRelative
				screen.barPosition = this.xRelative < 1 ? this.win.borderMargin : this.xRelative > 99 ? this.win.w - this.win.borderMargin : this.mouse.x
				window.unlighter.sendToMain({msg: 'monitors-str-changed', monitorsStr: this.monitorsStr})
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
		monitorsStr() {
			const now = new Date()
			return this.monitors.map(monitor => ({
				str: monitor.str,
				time: now
			}))
		}
	},
	mounted() {
		window.addEventListener("mouseup", () => {
			this.mup()
		})
		window.addEventListener("mousemove", (event) => {
			this.mmove(event)
		})
		window.unlighter.fromMain('init-pcc', (event, data) => {
			this.init(data)
		})
		window.unlighter.sendToMain({msg: 'ask-for-init-pcc'})
	}
}
</script>

<style lang="sass" scoped>

.monitors-controller
	display: flex
	flex-direction: column
	gap: 6px
	.monitor-container
		position: relative
		display: flex
		justify-content: space-between
		align-items: center
		padding: 0 30px
		height: 80px
		font-weight: 500
		cursor: url('./../assets/cursor_hover.svg') 13.5 6, pointer
		border-color: rgba(255,255,255,0.2)
		border-style: solid
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