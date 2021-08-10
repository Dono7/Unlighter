<template>
	<div class="title-bar">
		<div class="title"><img id="icon" src="@/assets/icon.svg" alt="Unlighter logo icno">Unlighter</div>
		<div class="actions">
			<div class="minimize" @click="minimize"><img src="@/assets/minimize.svg"></div>
			<div class="close" @click="quit"><img src="@/assets/close.svg"></div>
		</div>
	</div>
	
</template>

<script>
export default {
	methods: {
		quit() {
			window.unlighter.execModuleMethod({module: 'app', method: 'exit'})
		},
		minimize() {
			window.unlighter.execModuleMethod({module: 'pcc', method: 'minimize'})
		}
	}
}
</script>

<style lang="sass" scoped>
$height: 60px
$btnHeight: 40px

.title-bar
	height: $height
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
		margin-right: ($height - $btnHeight) / 2
		> div 
			position: relative
			display: flex
			justify-content: center
			align-items: center
			height: $btnHeight
			width: $btnHeight
			transition: all 0.15s
			cursor: pointer
			&:hover
				background-color: rgba(255,255,255,0.10)
			&.close:hover
				background-color: rgba(255,100,100,0.20)


</style>