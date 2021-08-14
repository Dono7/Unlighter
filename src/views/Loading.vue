<template>
	<main>
		<div class="loading-animation">
			<IconAnimation @animation-end="closeLoader"/>
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
		const isCloseOrderSent = ref(false)

		const closeLoader = () => {
			if(isCloseOrderSent.value) return

			isCloseOrderSent.value = true
			window.unlighter.execAppMethod({method: 'closeLoader'})
		}

    onBeforeMount(() => {
      window.unlighter.on('app-version', (event, v) => {
        version.value = v
      })

			document.body.addEventListener('click', closeLoader)

      window.unlighter.execModuleMethod({module: "updater", method: 'sendVersion'})
    })

    onUnmounted(() => {
      window.unlighter.removeListener('app-version')
    })

    return { version, closeLoader }
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