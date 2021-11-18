<script setup>
const quit = () => {
	window.unlighter.execModuleMethod({ module: "electron", method: "exit" })
}
const minimize = () => {
	window.unlighter.execModuleMethod({ module: "Pcc", method: "minimize" })
}
</script>

<template>
	<div class="title-bar">
		<div class="menu-opener">
			<img src="@/assets/svg/dots.svg" alt="menu-opener-icon" />
		</div>
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
	.menu-opener
		-webkit-app-region: no-drag
		@include flex-center
		width: 70px
		height: inherit
		background: transparent
		transition: $titlebar-btn-transition
		cursor: pointer
		&:hover
			background: $titlebar-btn-hover-white
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
