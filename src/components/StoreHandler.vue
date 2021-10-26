<template>
	<div class="store-handler"></div>
</template>

<script>
import { onBeforeMount } from "vue"
import { useStore } from "vuex"

export default {
	setup() {
		const store = useStore()

		onBeforeMount(() => {
			window.unlighter.execModuleMethod({ module: "Pcc", method: "sendVersion" })

			window.unlighter.once("app-version", (event, v) => {
				store.commit("app/version", v)
			})

			window.unlighter.once("update-available", (event, v) => {
				store.commit("app/updateAvailable", v)
			})

			window.unlighter.on("update-lastcheck", (event, lastUpdateCheckString) => {
				store.commit("app/lastUpdateCheckString", lastUpdateCheckString)
			})
		})
	},
}
</script>

<style></style>
