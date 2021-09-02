<template>
	<p v-if="version" class="version" :class="absolute ? 'version-absolute' : 'version'">{{version}}</p>
</template>

<script>
import { onBeforeMount, ref } from 'vue'

export default {
	props: {
		absolute: { type: Boolean, default: false },
		prefix: { type: String, default: 'v' },
	},
	setup(props) {
		const version = ref(null)

		onBeforeMount(() => {
			window.unlighter.once('app-version', (event, v) => {
				version.value = `${props.prefix}${v}`
			})
			window.unlighter.execAppMethod({method: 'sendVersion'})
		})

		return { version }
	}
}
</script>

<style scoped lang="sass">
p.version
	font-size: 12px
	color: white
	padding: 0
	margin: 0
	opacity: 0
	transition: opacity 1s 0.5s
	&.version-absolute
		position: absolute
		bottom: 20px
		left: 50%
		transform: translateX(-50%)
	&:not(:empty)
		opacity: 0.7
</style>