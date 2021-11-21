<script setup>
import { onMounted, ref } from "vue"
import Link from "@/components/Link"
import Version from "@/components/Version"

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
			<Link href="https://github.com/Dono7/Unlighter">Github</Link>.
		</p>

		<p>
			You learn more about Unlighter on our website
			<Link href="https://unlighter.app/">https://unlighter.app</Link>
		</p>

		<p>
			This app is developped by
			<Link href="https://github.com/Dono7">Donovan T.</Link> and designed by
			<Link href="https://www.behance.net/bourhanewac933">Walid B</Link>.
		</p>

		<p></p>

		<Version prefix="Unlighter v" />
	</main>
</template>

<style lang="sass" scoped>
.about
  display: flex
  flex-direction: column
  gap: 24px
</style>
