<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted, computed } from "vue"
import { useStore } from "vuex"

const store = useStore()
const monitorIndex = ref(null)

const showIndex = ref(false)
const color = ref("rgba(250,250,250,0.9)")
const strInfo = ref(0)
const showStrInfos = ref(false)
const showStrTimeout = ref(null)

const filterStr = computed(() => {
	if (monitorIndex.value === null) {
		return {
			str: 0,
			textColor: "white",
			bgc: "transparent",
		}
	} else {
		return store.getters["monitors/listForFilters"][monitorIndex.value]
	}
})

const updateStr = (str) => {
	const textColor = Math.max(0.3, Math.min(1 - str / 100, 1))
	document.body.style.background = `rgba(0,0,0,${(str / 100) * 0.95})`
	color.value = `rgba(250,250,250,${textColor})`
	strInfo.value = str
}

const hideStr = () => {
	showStrInfos.value = false
	showStrTimeout.value = null
}

const showStrFun = () => {
	showStrInfos.value = true
	if (showStrTimeout.value) {
		clearTimeout(showStrTimeout.value)
	}
	showStrTimeout.value = setTimeout(hideStr, 1200)
}

onBeforeMount(() => {
	document.body.classList.add("filter")
	document.body.classList.add("not-init")

	window.unlighter.on("update-str", (e, { str, init, showStr }) => {
		if (init) {
			setTimeout(() => {
				document.body.classList.remove("not-init")
			}, 1000)
		}
		if (showStr) {
			showStrFun()
		} else {
			hideStr()
		}
		updateStr(str)
	})

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
	<div id="filter" :style="{ background: filterStr.bgc }">
		<h4 v-show="showStrInfos">Unlighter: {{ filterStr.str }}</h4>
		<h1
			v-show="monitorIndex !== null && showIndex"
			:style="{ color: filterStr.textColor }"
		>
			{{ monitorIndex + 1 }}
		</h1>
	</div>
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
		transition: all 1000ms
#filter
	width: 100%
	height: 100%
	padding: 30px
	h4
		padding: 6px 12px
		background: $background
		width: fit-content
		opacity: 0.7
	h1
		font-size: 250px
		font-weight: bold
		margin: 0 20px
		text-shadow: 3px ​3px 8px black
</style>
