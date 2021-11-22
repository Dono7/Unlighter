<script setup>
import { computed, onMounted, onUnmounted } from "vue"
import { useStore } from "vuex"
import MonitorSlider from "./MonitorSlider.vue"
const store = useStore()

// Computed variables
const monitorsList = computed(() => store.getters["monitors/getList"])
const isSomeoneActive = computed(() => store.getters["monitors/isSomeoneActive"])
const lastMouseXPosition = computed(() => store.state.monitors.lastMouseXPosition)
const lastRelativeMouseXPosition = computed(
	() => store.getters["monitors/lastRelativeMouseXPosition"],
)
const strengthListForFilters = computed(
	() => store.getters["monitors/strengthListForFilters"],
)

// Methods
const mdown = (index) => {
	store.commit("monitors/setActive", index)
	updateScreen(index)
}

const mup = () => {
	store.commit("monitors/setAllInactive")
}

const menter = (index) => {
	if (isSomeoneActive.value) {
		store.commit("monitors/setActive", index)
	}
}

const mmove = (event) => {
	storeMousePosition(event.clientX)
	if (isSomeoneActive.value) {
		monitorsList.value.forEach((screen, index) => updateScreen(index))
	}
}

const storeMousePosition = (x) => {
	if (
		(x >= 0 && x <= 100) ||
		(x < 0 && lastRelativeMouseXPosition !== 0) ||
		(x > 100 && lastRelativeMouseXPosition !== 100)
	) {
		store.commit("monitors/lastMouseXPosition", event.clientX)
	}
}

const updateScreen = (index) => {
	if (monitorsList.value[index].isActive) {
		const newStr = lastRelativeMouseXPosition.value
		const newBarPosition =
			screen.str < 1 ? 0 : screen.str > 99 ? 320 : lastMouseXPosition.value
		store.commit("monitors/setStrAndBarPos", { newStr, newBarPosition, index })
		// syncFiltersWithList()
	}
}

const syncFiltersWithList = (forceFiltersInit = false) => {
	window.unlighter.execModuleMethod({
		module: "Monitors",
		method: "updateMonitorsStr",
		args: [strengthListForFilters.value, { init: forceFiltersInit }],
	})
}

// Lifecycle event
onMounted(() => {
	store.subscribe((mutation) => {
		const acceptedTypes = ["monitors/list", "monitors/setStrAndBarPos"]

		if (acceptedTypes.includes(mutation.type)) {
			window.unlighter.execModuleMethod({
				module: "Monitors",
				method: "synchronizeStoreMutationWithFilter",
				args: [mutation],
			})
		}
	})

	window.addEventListener("mouseup", mup)
	window.addEventListener("mousemove", mmove)
})

onUnmounted(() => {
	window.removeEventListener("mouseup", mup)
	window.removeEventListener("mousemove", mmove)
})
</script>

<template>
	<div class="monitors-controller">
		<MonitorSlider
			v-for="(screen, index) in monitorsList"
			:key="index"
			:index="index"
			:screen="screen"
			@click="updateScreen(index)"
			@mousedown="mdown(index)"
			@mouseenter="menter(index)"
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
