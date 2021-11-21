<script setup>
import { computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
const store = useStore()

const props = defineProps({
	absolute: { type: Boolean, default: false },
	prefix: { type: String, default: "v" },
})

const mounted = ref(false)
const version = computed(() => store.state.app.version)

onMounted(() => {
	if (props.absolute) {
		setTimeout(() => {
			mounted.value = true
		}, 1000)
	} else {
		mounted.value = true
	}
})

const className = computed(() => [
	props.absolute ? "version-absolute" : "",
	!!version && mounted.value ? "display" : "",
])
</script>

<template>
	<p class="version" :class="className">{{ prefix + version }}</p>
</template>

<style lang="sass" scoped>
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
