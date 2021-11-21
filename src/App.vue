<script setup>
import StoreHandler from "@/components/StoreHandler"
import { onBeforeMount } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

onBeforeMount(() => {
	window.unlighter.on("go-to", (event, name) => {
		router.replace({ name })
	})
})
</script>

<template>
	<StoreHandler />
	<router-view></router-view>
</template>

<style lang="sass">
*
	margin: 0
	padding: 0
	box-sizing: border-box
	user-select: none

body
	position: relative
	width: 100%
	height: 100vh
	background-color: $background
	overflow: hidden
	color: white
	font-family: 'Poppins'
	font-weight: 500

h1
	margin-bottom: 15px
	font-weight: 500
	font-size: 20px
</style>
