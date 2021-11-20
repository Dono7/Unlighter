<script setup>
import { onBeforeMount, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import IconAnimation from "@/components/IconAnimation"
import Version from "@/components/Version"

const isPccInit = ref(false)
const isCloseAsked = ref(false)
const isRedirected = ref(false)
const emit = defineEmits(["close-loading"])

const closeLoader = () => {
	if (isPccInit.value) closeLoading()
	else isCloseAsked.value = true
}

const pccInited = () => {
	if (isCloseAsked.value) closeLoading()
	else isPccInit.value = true
}

const closeLoading = () => {
	if (isRedirected.value) return

	isRedirected.value = true
	emit("close-loading")
}

onBeforeMount(() => {
	window.unlighter.once("init-pcc", pccInited)
	document.body.addEventListener("click", closeLoader)
})

// Security redirection to avoid being blocked in animation
onMounted(() => {
	setTimeout(() => {
		closeLoading()
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
	position: absolute
	top: 0
	left: 0
	height: 100%
	width: 100%
	background: $background
	z-index: 10
.loading-animation
	padding-top: 140px
</style>
