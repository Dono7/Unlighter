<script setup>
import SearchForUpdate from "@/components/SearchForUpdate"
import Version from "@/components/Version.vue"
import Link from "@/components/Link.vue"

import { useStore } from "vuex"
import { computed } from "vue"

const store = useStore()
const isUpToDate = computed(() => store.getters["app/isUpToDate"])

const openUpdaterWindow = () => {
	window.unlighter.execModuleMethod({ module: "Updater", method: "openWindow" })
}
</script>

<template>
	<main class="update">
		<div class="search-for-update">
			<SearchForUpdate @click="openUpdaterWindow" />
		</div>

		<div class="current-version">
			<Version prefix="Current version " />
			<template v-if="isUpToDate">
				<img class="version-check" src="@/assets/svg/checked.svg" />
				<p class="up-to-date">Up to date</p>
			</template>
		</div>

		<div class="older-versions">
			<h2>Older versions</h2>

			<p>
				If you are experiencing some issues with newer versions, please feel free to
				download an older versions from the website :
				<Link href="https://unlighter.app/download">https://unlighter.app/download</Link>
			</p>
		</div>
	</main>
</template>

<style lang="sass" scoped>
main.update
	> .search-for-update
		margin-bottom: 20px
	.current-version
		display: flex
		align-items: center
		margin-bottom: 40px
		.version-check
			margin-left: 18px
			margin-right: 6px
		.up-to-date
			color: $valid
</style>
