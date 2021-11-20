<script setup>
import { onMounted, ref } from "vue"
import Link from "@/components/Link"
import Version from "@/components/Version"
import SearchForUpdate from "@/components/SearchForUpdate"

const openUpdaterWindow = () => {
	window.unlighter.execModuleMethod({ module: "Updater", method: "openWindow" })
}

const isUpdateAvailable = ref(false)

onMounted(() => {
	if (document.querySelector("a.router-link-exact-active.notif") !== null) {
		isUpdateAvailable.value = true
	}
	window.unlighter.once("update-available", () => {
		isUpdateAvailable.value = true
	})
})
</script>

<template>
	<main class="about">
		<p>
			Unlighter is a an open-source project. The source-code is available on
			<Link href="https://github.com/Dono7/Unlighter" label="Github" />. You can download
			or learn more about Unlighter on the website
			<Link href="https://unlighter.app/" label="unlighter.app" />.
		</p>

		<p>
			This application is developped by
			<Link href="https://github.com/Dono7" label="Donovan T." /> and designed by
			<Link href="https://www.behance.net/bourhanewac933" label="Walid B" />.
		</p>

		<SearchForUpdate @click="openUpdaterWindow" />

		<Version prefix="Current version " />
	</main>
</template>

<style lang="sass">
.about
  display: flex
  flex-direction: column
  gap: 12px
  p
    font-size: 12px
</style>
