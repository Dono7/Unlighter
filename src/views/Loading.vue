<template>
	<div class="loading-container">
		<div class="loading-animation">
			<IconAnimation @animation-end="closeLoader"/>
		</div>
		<p class="version">{{version}}</p>
	</div>
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
      window.unlighter.once('app-version', (event, v) => {
        version.value = 'v' + v
      })

			window.unlighter.once('init-pcc', (event, data) => {
				console.log('pcc inited, closeLoader')
				window.unlighter.execAppMethod({method: 'closeLoader'})
			})

			document.body.addEventListener('click', closeLoader)

      window.unlighter.execModuleMethod({module: "updater", method: 'sendVersion'})
    })

    return { version, closeLoader }
	}
}
</script>

<style scoped lang="sass">
.loading-container
	position: fixed
	top: 0
	left: 0
	height: 100vh
	width: 100vw
.loading-animation
	padding-top: 140px
.version
	position: absolute
	font-size: 12px
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