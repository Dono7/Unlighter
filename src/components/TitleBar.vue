<script setup>
import { useStore } from "vuex"
import IconHamburgerAnimatedVue from "./IconHamburgerAnimated.vue"
const store = useStore()

const quit = () => {
	window.unlighter.execModuleMethod({ module: "electron", method: "exit" })
}
const minimize = () => {
	window.unlighter.execModuleMethod({ module: "Pcc", method: "minimize" })
}
const toggleMenu = () => store.commit("menu/toggleMenu")
</script>

<template>
	<div class="title-bar">
		<IconHamburgerAnimatedVue @click="toggleMenu" />
		<div class="actions">
			<div class="minimize" @click="minimize">
				<img src="@/assets/svg/minimize.svg" />
			</div>
			<div class="close" @click="quit"><img src="@/assets/svg/close.svg" /></div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
.title-bar
	height: $titlebar-height
	width: 100%
	display: flex
	justify-content: space-between
	align-items: center
	letter-spacing: 0.6px
	-webkit-app-region: drag
	border-bottom: $titlebar-border
	.actions
		-webkit-app-region: no-drag
		display: flex
		height: inherit
		> div
			position: relative
			@include flex-center
			height: inherit
			width: 64px
			transition: $titlebar-btn-transition
			cursor: pointer
			&:hover
				background-color: $titlebar-btn-hover-white
			&.close:hover
				background-color: $titlebar-btn-hover-red
</style>
