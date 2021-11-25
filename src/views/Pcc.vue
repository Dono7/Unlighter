<script setup>
import TitleBar from "@/components/TitleBar.vue"
import IconBanner from "@/components/IconBanner.vue"
import MonitorsController from "@/components/MonitorsController.vue"
import Loading from "./Loading.vue"
import Menu from "./Menu.vue"
import { computed, ref } from "vue"
import { useStore } from "vuex"

const store = useStore()

const showLoading = ref(true)
const showMenu = computed(() => store.state.menu.isOpen)
</script>

<template>
	<TitleBar />
	<div class="pcc-content">
		<transition name="fade">
			<Loading v-if="showLoading" @close-loading="showLoading = false" />
		</transition>
		<transition name="menu">
			<Menu v-if="showMenu" />
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
