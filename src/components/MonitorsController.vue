<template>
	<div class="monitors-controller" :style="{ padding: `0 ${win.deadMargin}px` }">
		<div 
			v-for="(screen, index) in monitors"
			:key="index"
			class="monitor-container"
			:class="{active: screen.isActive}"
			@click="updateScreen(screen)"
			@mousedown="mdown(screen)"
			@mouseenter="menter(screen)"
		>

			<div class="progressbar" v-bind:style="{ width: screen.str + '%' }"></div>
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
				deadMargin: 0,
			},
			monitors: [
				{ id: 1, index: 0, str: 0, barPosition: 0, name: 'Loading...', isActive: false },
			],
			initialised: false
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
			this.initialised = true
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
				const relative = this.xRelative
				screen.str = relative
				screen.barPosition = relative < 1 ? 0 : relative > 99 ? this.win.w - this.win.deadMargin : this.mouse.x
				this.sendStrToMonitors()
			}
		},
		sendStrToMonitors() {
			if(this.initialised) {
				window.unlighter.execModuleMethod({module: "monitors", method: 'updateMonitorsStr', args: [this.monitorsStr]})
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
			const x = this.round( ( this.mouse.x - this.win.deadMargin ) / factor ,2)
			return x < 1 ? 0 : x > 99 ? 100 : x
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
		window.unlighter.on('init-pcc', (event, data) => {
			this.init(data)
			window.unlighter.execAppMethod({method: 'closeLoader'})
		})
		window.unlighter.on('ask-for-monitors-str', () => {
			this.sendStrToMonitors()
		})

		window.unlighter.execAppMethod({method: 'sendToPccFromCode', args: ['ask-for-init-pcc']})
		
		window.addEventListener("mouseup", this.mup)
		
		window.addEventListener("mousemove", this.mmove)
	},
	unmounted() {
		window.unlighter.removeListener('init-pcc')
		window.unlighter.removeListener('ask-for-monitors-str')
		window.removeEventListener("mouseup", this.mup)
		window.removeEventListener("mousemove", this.mmove)
	}
}
</script>

<style lang="sass" scoped>
@import '@/assets/sass/variables.sass'

$border-size: 2px
.monitors-controller
	display: flex
	flex-direction: column
	gap: 8px
	.monitor-container
		position: relative
		display: flex
		justify-content: space-between
		align-items: center
		padding: 0 30px
		height: 75px
		font-weight: 500
		cursor: url('./../assets/svg/cursor_hover.svg') 13.5 6, pointer
		border-color: rgba(255,255,255,0.2)
		border-style: solid
		border-width: 0
		font-size: 12px
		.progressbar
			position: absolute
			top: 0
			bottom: 0
			left: 0
			width: 0%
			background-color: $secondary
			&::before
				content: ''
				position: absolute
				left: 0
				bottom: 0
				width: 100%
				height: $border-size
				background: $primary
		&.active
			.progressbar
				border-right: 1px solid rgba(255,255,255,0.7)
		&::before
			content: ''
			position: absolute
			left: 0
			bottom: 0
			width: 100%
			height: $border-size
			background: rgba(255,255,255,0.1)

</style>