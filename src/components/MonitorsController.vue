<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"

// Variables
const initialised = ref(false)
const mouse = ref({ x: 0, y: 0 })
const win = ref({ w: 320, h: 400 })
const monitors = ref([
	{ id: 1, index: 0, str: 0, barPosition: 0, name: "Loading...", isActive: false },
])

// Computed
const xRelative = computed(() => {
	const factor = win.value.w / 100
	const x = round(mouse.value.x / factor, 2)
	return x < 1 ? 0 : x > 99 ? 100 : x
})

const isSomeoneActive = computed(() => {
	return monitors.value.some((screen) => screen.isActive)
})

const monitorsStr = computed(() => {
	return monitors.value.map((monitor) => ({
		str: monitor.str,
		time: new Date(),
	}))
})

// Methods

const init = ({ monitors: m, sendStrAfterInit }) => {
	monitors.value = m.map((monitor, index) => {
		return {
			id: monitor.id,
			index: index,
			str: monitor.str,
			barPosition: barPositionFromStr(monitor.str),
			name: monitor.name,
			isActive: false,
		}
	})
	initialised.value = true
	if (sendStrAfterInit) sendStrToMonitors(true)
}

const barPositionFromStr = (str) => {
	return round((win.value.w / 100) * str, 1)
}

const mdown = (screen) => {
	screen.isActive = true
	updateScreen(screen)
}

const mup = () => {
	monitors.value.forEach((screen) => (screen.isActive = false))
}

const menter = (screen) => {
	if (isSomeoneActive.value) {
		screen.isActive = true
	}
}

const mmove = (event) => {
	mouse.value.x = event.clientX
	mouse.value.y = event.clientY
	if (isSomeoneActive.value) {
		monitors.value.forEach((screen) => updateScreen(screen))
	}
}

const updateScreen = (screen) => {
	if (screen.isActive) {
		screen.str = xRelative.value
		screen.barPosition =
			screen.str < 1 ? 0 : screen.str > 99 ? win.value.w : mouse.value.x
		sendStrToMonitors()
	}
}

const sendStrToMonitors = (init = false) => {
	if (initialised.value) {
		window.unlighter.execModuleMethod({
			module: "Monitors",
			method: "updateMonitorsStr",
			args: [monitorsStr.value, { init }],
		})
	}
}

const round = (number, precision) => {
	const factor = Math.pow(10, precision)
	return Math.round(number * factor) / factor
}

// Lifecycle event

onMounted(() => {
	window.unlighter.on("init-pcc", (event, data) => {
		init(data)
	})
	window.unlighter.on("ask-for-monitors-str", () => {
		sendStrToMonitors()
	})

	window.unlighter.execModuleMethod({
		module: "Pcc",
		method: "sendToPccFromCode",
		args: ["ask-for-init-pcc"],
	})

	window.addEventListener("mouseup", mup)
	window.addEventListener("mousemove", mmove)
})

onUnmounted(() => {
	window.unlighter.removeListener("init-pcc")
	window.unlighter.removeListener("ask-for-monitors-str")
	window.removeEventListener("mouseup", mup)
	window.removeEventListener("mousemove", mmove)
})
</script>

<template>
	<div class="monitors-controller">
		<div
			v-for="(screen, index) in monitors"
			:key="index"
			class="monitor-container"
			:class="{ active: screen.isActive }"
			@click="updateScreen(screen)"
			@mousedown="mdown(screen)"
			@mouseenter="menter(screen)"
		>
			<div class="progressbar" v-bind:style="{ width: screen.str + '%' }"></div>
			<div class="monitor-name">
				{{ screen.name ? `${screen.name}` : `Monitor ${index + 1}` }}
			</div>
			<div class="pourcentage">{{ Math.round(screen.str) }}</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
@import '@/assets/sass/variables.sass'

$border-size: 2px
.monitors-controller
	display: flex
	flex-direction: column
	gap: 8px
	padding: 0
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
