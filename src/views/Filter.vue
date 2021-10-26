<template>
	<div id="filter">
		<h4 v-show="showStrInfos">Unlighter: {{ strInfo }}</h4>
		<h1 v-show="monitorIndex && showIndex" :style="{ color }">
			{{ monitorIndex }}
		</h1>
	</div>
</template>

<script>
import { onBeforeMount, onUnmounted } from "@vue/runtime-core"
import { ref } from "vue"

export default {
	setup() {
		const monitorIndex = ref(null)
		const showIndex = ref(false)
		const color = ref("rgba(250,250,250,0.9)")
		const strInfo = ref(0)
		const showStrInfos = ref(false)
		const showStrTimeout = ref(null)

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
				monitorIndex.value = index + 1
			})

			window.unlighter.on("show-index", () => {
				showIndex.value = true
			})

			window.unlighter.on("hide-index", () => {
				showIndex.value = false
			})
		})

		onUnmounted(() => {
			window.unlighter.removeListener("update-str")
			window.unlighter.removeListener("update-index")
			window.unlighter.removeListener("show-index")
			window.unlighter.removeListener("hide-index")
		})

		return { monitorIndex, showIndex, color, strInfo, showStrInfos }
	},
}
</script>

<style lang="sass">
@import '@/assets/sass/variables.sass'

body.filter
	width: 100%
	min-height: 100vh
	margin: 0
	height: 0
	background: transparent
	overflow: hidden
	background: rgba(0,0,0,0.0)
	&.not-init
		transition: all 1000ms

	#window
		background: transparent
#filter
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
