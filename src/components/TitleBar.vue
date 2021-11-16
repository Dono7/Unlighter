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
		<div class="title">
			<img id="icon" src="@/assets/svg/icon.svg" alt="Unlighter logo icno" />Unlighter
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
	.title
		padding-left: 30px
		display: flex
		align-items: center
		#icon
			height: 30px
			width: 30px
			margin-right: 5px
	.actions
		-webkit-app-region: no-drag
		display: flex
		margin-right: ($titlebar-height - $titlebar-btn-height) / 2
		> div
			position: relative
			display: flex
			justify-content: center
			align-items: center
			height: $titlebar-btn-height
			width: $titlebar-btn-height
			transition: all 0.15s
			cursor: pointer
			&:hover
				background-color: rgba(255,255,255,0.10)
			&.close:hover
				background-color: rgba(255,100,100,0.20)
</style>
