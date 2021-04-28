<template>
	<div class="title-bar">
		<div class="title">Unlighter</div>
		<div class="actions">
			<div class="minimize"><img src="./../assets/minimize.svg"></div>
			<div class="close"><img src="./../assets/close.svg"></div>
		</div>
	</div>
	
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>
.title-bar
	height: 60px
	width: 100%
	display: flex
	justify-content: space-between
	align-items: center
	-webkit-app-region: drag
	.title
		padding-left: 30px
	.actions
		-webkit-app-region: no-drag
		display: flex
		> div 
			display: flex
			justify-content: center
			align-items: center
			height: 60px
			width: 60px
			transition: all 0.15s
			cursor: pointer
			&:hover
				background-color: rgba(255,255,255,0.10)
			&.close:hover
				background-color: rgba(255,100,100,0.20)
</style>