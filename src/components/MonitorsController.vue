<script setup>
import { computed, onMounted, onUnmounted } from "vue"
import { useStore } from "vuex"
import MonitorSlider from "./MonitorSlider.vue"
const store = useStore()
const windowWidth = 320

// Computed variables
const monitorsList = computed(() => store.getters["monitors/getList"])
const isSomeoneActive = computed(() => store.getters["monitors/isSomeoneActive"])
const lastRelativeMouseXPosition = computed(
	() => store.getters["monitors/lastRelativeMouseXPosition"],
)

// Mouse events
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
		(x >= 0 && x <= windowWidth) ||
		(x < 0 && lastRelativeMouseXPosition.value !== 0) ||
		(x > windowWidth && lastRelativeMouseXPosition.value !== 100)
	) {
		store.commit("monitors/lastMouseXPosition", event.clientX)
	}
}

const updateScreen = (index) => {
	if (monitorsList.value[index].isActive) {
		const newStr = lastRelativeMouseXPosition.value
		store.commit("monitors/setStr", { newStr, index })
	}
}

// Lifecycle event
onMounted(() => {
	store.subscribe((mutation) => {
		const acceptedTypes = ["monitors/list", "monitors/setStr", "monitors/addValueToAll"]

		if (acceptedTypes.includes(mutation.type)) {
			window.unlighter.execModuleMethod({
				module: "Monitors",
				method: "synchronizeStoreMutationWithFilter",
				args: [mutation],
			})
		}
	})

	window.unlighter.execModuleMethod({
		module: "Pcc",
		method: "onPccMounted",
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
