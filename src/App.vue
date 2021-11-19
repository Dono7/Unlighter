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

<style lang="sass"></style>
