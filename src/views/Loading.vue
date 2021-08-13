<template>
	<main>
		<div class="loading-animation">
			<IconAnimation />
		</div>
		<p class="version">{{version}}</p>
	</main>
</template>

<script>
import IconAnimation from '@/components/IconAnimation.vue'
import { onBeforeMount, onUnmounted, ref } from 'vue'

export default {
	components: { IconAnimation },
	setup() {
		const version = ref(null)

    onBeforeMount(() => {
      window.unlighter.on('app-version', (event, v) => {
        version.value = v
      })

      window.unlighter.execModuleMethod({module: "updater", method: 'sendVersion'})
    })

    onUnmounted(() => {
      window.unlighter.removeListener('app-version')
    })

    return { version }
	}
}
</script>

<style scoped lang="sass">

.loading-animation
	padding-top: 140px
.version
	position: absolute
	font-size: 100px
	bottom: 20px
	left: 50%
	transform: translateX(-50%)
	color: white
	padding: 0
	margin: 0
	opacity: 0
	transition: opacity 1s 0.5s
.version:not(:empty)
	opacity: 0.7


</style>