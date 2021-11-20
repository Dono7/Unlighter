<script setup>
import TitleBar from "../components/TitleBar.vue"
import IconBanner from "../components/IconBanner.vue"
import MonitorsController from "../components/MonitorsController.vue"
import Loading from "./Loading.vue"
import { ref } from "vue"

const showLoading = ref(true)
</script>

<template>
	<TitleBar />
	<div class="pcc-content">
		<transition name="fade">
			<Loading v-if="showLoading" @close-loading="showLoading = false" />
		</transition>
		<IconBanner />
		<div class="monitors">
			<MonitorsController />
		</div>
	</div>
</template>

<style lang="sass" scoped>
.pcc-content
	position: relative
</style>
