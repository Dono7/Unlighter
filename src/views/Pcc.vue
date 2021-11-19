<script setup>
import TitleBar from "../components/TitleBar.vue"
import IconBanner from "../components/IconBanner.vue"
import MonitorsController from "../components/MonitorsController.vue"
</script>

<template>
	<TitleBar />
	<IconBanner />
	<div class="monitors">
		<MonitorsController />
	</div>
</template>
