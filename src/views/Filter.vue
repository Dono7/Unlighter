<template>
	<h1 v-if="monitorIndex && showIndex" :style="{color}">
		{{monitorIndex}}
	</h1>
</template>

<script>
import { onBeforeMount } from '@vue/runtime-core'
import { ref } from 'vue'

export default {
	setup() {
		const monitorIndex = ref(null)
		const showIndex = ref(false)
		const color = ref('rgba(250,250,250,0.9)')

		onBeforeMount(() => {
			document.body.classList.add('filter')

			window.unlighter.on('update-str', (str) => {
				const textColor = Math.max(0.3, Math.min(1 - str / 100, 1))
				document.body.style.background = `rgba(0,0,0,${str / 100 * 0.95})`
				color.value = `rgba(250,250,250,${textColor})`
			})

			window.unlighter.on('update-index', (index) => {
				monitorIndex.value = index + 1
			})

			window.unlighter.on('show-index', () => {
				showIndex.value = true
			})

			window.unlighter.on('hide-index', () => {
				showIndex.value = false
			})
		})

		return { monitorIndex, showIndex, color }
	}
}
</script>

<style lang="sass">
body.filter
	width: 100%
	min-height: 100vh
	margin: 0
	height: 0
	background: transparent
	overflow: hidden
	background: rgba(0,0,0,0.1)

	#window
		background: transparent

	h1
		font-size: 250px
		font-weight: bold
		margin: 25px 50px
		text-shadow: 3px ​3px 8px black
</style>