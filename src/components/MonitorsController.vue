<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import MonitorSlider from "./MonitorSlider.vue"

// Variables
const initialised = ref(false)
const mouse = ref({ x: 0, y: 0 })
const win = ref({ w: 320, h: 416 })
const monitors = ref([
	{ id: 1, index: 0, str: 0, barPosition: 0, name: "Loading...", isActive: false },
	{ id: 2, index: 1, str: 0, barPosition: 0, name: "Loading...", isActive: false },
	{ id: 3, index: 2, str: 0, barPosition: 0, name: "Loading...", isActive: false },
	{ id: 4, index: 3, str: 0, barPosition: 0, name: "Loading...", isActive: false },
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
	return monitors.value
		.filter((monitor) => monitor.isDetected)
		.map((monitor) => ({
			str: monitor.str,
			time: new Date(),
		}))
})

// Methods

const init = ({ monitors: m, sendStrAfterInit }) => {
	monitors.value = monitors.value.map((monitor, index) => {
		const mtmp = m[index]
		return {
			id: mtmp?.id ?? monitor.id,
			index: index,
			str: mtmp?.str ?? monitor.str,
			barPosition: barPositionFromStr(mtmp?.str ?? monitor.str),
			name: mtmp?.name ?? "Monitor " + (index + 1),
			isActive: false,
			isDetected: !!mtmp?.id,
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
		<MonitorSlider
			v-for="(screen, index) in monitors"
			:key="index"
			:index="index"
			:screen="screen"
			@click="updateScreen(screen)"
			@mousedown="mdown(screen)"
			@mouseenter="menter(screen)"
		/>
	</div>
</template>

<style lang="sass" scoped>
.monitors-controller
	display: flex
	flex-direction: column
	gap: 1px
	padding: 0
</style>
