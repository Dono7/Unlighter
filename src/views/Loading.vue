<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"
import IconAnimation from "@/components/IconAnimation"
import Version from "@/components/Version"

const isPccInit = ref(false)
const isCloseAsked = ref(false)
const isRedirected = ref(false)
const router = useRouter()

const closeLoader = () => {
	if (isPccInit.value) goToHome()
	else isCloseAsked.value = true
}

const pccInited = () => {
	if (isCloseAsked.value) goToHome()
	else isPccInit.value = true
}

const goToHome = () => {
	if (isRedirected.value) return

	isRedirected.value = true
	router.replace({ name: "Monitors" })
}

onBeforeMount(() => {
	window.unlighter.once("init-pcc", pccInited)
	document.body.addEventListener("click", closeLoader)
})

// Security redirection to avoid being blocked in animation
onMounted(() => {
	setTimeout(() => {
		goToHome()
	}, 3000)
})
</script>

<template>
	<div class="loading-container">
		<div class="loading-animation">
			<IconAnimation @animation-end="closeLoader" />
		</div>
		<Version absolute />
	</div>
</template>

<style scoped lang="sass">
.loading-container
	position: fixed
	top: 0
	left: 0
	height: 100vh
	width: 100vw
.loading-animation
	padding-top: 140px
</style>
