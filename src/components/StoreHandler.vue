<template>
	<div class="store-handler"></div>
</template>

<script>
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'

export default {
	setup() {
		const store = useStore()

		onBeforeMount(() => {
			window.unlighter.execAppMethod({method: 'sendVersion'})

			window.unlighter.once('app-version', (event, v) => {
				store.commit('app/version', v)
			})
			
			window.unlighter.once('update-available', (event, v) => {
				store.commit('app/updateAvailable', v)
			})
		})
	}
}
</script>

<style>

</style>