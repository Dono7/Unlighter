<template>
	<div class="title-bar">
		<div class="title">Unlighter</div>
		<div class="actions">
			<div class="minimize" @click="minimize"><img src="./../assets/minimize.svg"></div>
			<div class="close" @click="quit"><img src="./../assets/close.svg"></div>
		</div>
	</div>
	
</template>

<script>
export default {
	methods: {
		quit() {
			window.unlighter.sendToMain({msg:'quit'})
		},
		minimize() {
			window.unlighter.sendToMain({msg:'minimize'})
		}
	}
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
			position: relative
			display: flex
			justify-content: center
			align-items: center
			height: 38px
			width: 38px
			transition: all 0.15s
			cursor: pointer
			margin-right: 11px
			border-radius: 5px
			&:hover
				background-color: rgba(255,255,255,0.10)
			&.close:hover
				background-color: rgba(255,100,100,0.20)


</style>