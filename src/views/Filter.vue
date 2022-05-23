<script setup>
import { ref, watch, onBeforeMount, onMounted, onUnmounted, computed } from "vue"
import { useStore } from "vuex"

const store = useStore()
const monitorIndex = ref(0)
const mounted = ref(false)

const showIndex = ref(false) // Should be replaced but a property from the store
const showStrWhenShortcutTriggered = ref(false)
const showStrTimeout = ref(null)
const isUsingShortcuts = computed(() => store.state.monitors.isUsingShortcuts)

const filterStr = computed(
	() => store.getters["monitors/listForFilters"][monitorIndex.value],
)

// Handle show filter value only when shortcut is pressed
watch(filterStr, () => {
	if (isUsingShortcuts.value) {
		if (showStrTimeout.value) {
			clearTimeout(showStrTimeout.value)
		}

		showStrWhenShortcutTriggered.value = true
		showStrTimeout.value = setTimeout(() => {
			showStrWhenShortcutTriggered.value = false
		}, 1000)
	} else {
		showStrWhenShortcutTriggered.value = false
	}
})

onBeforeMount(() => {
	document.body.classList.add("filter")
	// document.body.classList.add("not-init")

	window.unlighter.on("update-index", (e, index) => {
		monitorIndex.value = index
	})

	window.unlighter.on("show-index", () => {
		showIndex.value = true
	})

	window.unlighter.on("hide-index", () => {
		showIndex.value = false
	})

	window.unlighter.on("sync-mutation", (event, mutation) => {
		store.commit(mutation.type, mutation.payload)
	})
})

onMounted(() => {
	mounted.value = true
	window.unlighter.execModuleMethod({
		module: "Monitors",
		method: "onFilterMounted",
	})
})

onUnmounted(() => {
	window.unlighter.removeListener("update-str")
	window.unlighter.removeListener("update-index")
	window.unlighter.removeListener("show-index")
	window.unlighter.removeListener("hide-index")
})
</script>

<template>
	<transition name="fade-filter">
		<div
			v-if="mounted"
			id="filter"
			:style="{ background: filterStr?.bgc ?? `rgba(0,0,0,0.0)` }"
		>
			<h4 v-show="showStrWhenShortcutTriggered">
				<span>Unlighter:</span>
				<span>{{ Math.round(filterStr?.str ?? 0) }}</span>
			</h4>
			<h1
				v-show="monitorIndex !== null && showIndex"
				:style="{ color: filterStr?.textColor ?? `white` }"
			>
				{{ monitorIndex + 1 }}
			</h1>
		</div>
	</transition>
</template>

<style lang="sass">
body.filter
	width: 100%
	min-height: 100vh
	margin: 0
	height: 0
	overflow: hidden
	background: rgba(0,0,0,0.0)
	&.not-init
		// transition: all 1000ms
#filter
	width: 100%
	height: 100%
	padding: 30px
	h4
		display: flex
		align-items: center
		justify-content: space-between
		padding: 6px 12px
		background: $background
		width: 135px
		opacity: 0.85
	h1
		font-size: 250px
		font-weight: bold
		margin: 0 20px
		text-shadow: 3px 3px 8px black
</style>
