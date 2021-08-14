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
import { useRouter } from 'vue-router'

export default {
	components: { IconAnimation },
	setup() {
		const version = ref(null)
		const isPccInit = ref(false)
		const isCloseAsked = ref(false)
		const router = useRouter()

		const closeLoader = () => {
			if(isPccInit.value)
				goToHome()
			else
				isCloseAsked.value = true
		}

		const pccInited = () => {
				if(isCloseAsked.value)
					goToHome()
				else
					isPccInit.value = true
		}

		const goToHome = () => {
			router.replace({name: 'Monitors'})
		}

    onBeforeMount(() => {
      window.unlighter.once('app-version', (event, v) => {
        version.value = `v${v}`
      })
			window.unlighter.once('init-pcc', pccInited)
			document.body.addEventListener('click', closeLoader)
			window.unlighter.execAppMethod({method: 'sendVersion'})
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