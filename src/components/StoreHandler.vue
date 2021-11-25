<script setup>
import { onBeforeMount, onMounted } from "vue"
import { useStore } from "vuex"
const store = useStore()

onBeforeMount(() => {
	window.unlighter.execModuleMethod({ module: "Pcc", method: "onStoreReady" })

	window.unlighter.once("set-app-version", (event, v) => {
		store.commit("app/version", v)
	})
	window.unlighter.once("set-monitors-list", (event, list) => {
		store.commit("monitors/list", { list })
	})

	window.unlighter.once("update-available", (event, v) => {
		store.commit("app/updateAvailable", v)
	})

	window.unlighter.on("update-lastcheck", (event, lastUpdateCheckString) => {
		store.commit("app/lastUpdateCheckString", lastUpdateCheckString)
	})

	window.unlighter.on("add-value-to-all-filters", (event, valueToAdd) => {
		store.commit("monitors/addValueToAll", valueToAdd)
	})
})

onMounted(() => {
	window.unlighter.execModuleMethod({
		module: "Pcc",
		method: "onStoreHandlerMounted",
	})
})
</script>

<template>
	<div class="store-handler"></div>
</template>
