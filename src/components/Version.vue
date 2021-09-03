<template>
	<p class="version" :class="className">{{version}}</p>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
	props: {
		absolute: { type: Boolean, default: false },
		prefix: { type: String, default: 'v' },
	},
	setup(props) {
		const store = useStore()

		const mounted = ref(false)
		
		onMounted(() => {
			if(props.absolute) {
				setTimeout(() => {
					mounted.value = true
				}, 1000)
			} else {
				mounted.value = true
			}
		})

		const version = computed(() => store.state.app.version)

		const className = computed(() => [
			props.absolute ? 'version-absolute' : '',
			!!version && mounted.value ? 'display' : '',
		])

		return { version, className }
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
	&.version-absolute
		position: absolute
		bottom: 20px
		left: 50%
		transform: translateX(-50%)
		transition: opacity 1s ease
	&.display
		opacity: 0.7
</style>