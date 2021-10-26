<template>
	<div class="switch-bg" :class="{ 'switch-on': value }" @click="$emit('valuechange')">
		<div class="switch-circle"></div>
	</div>
</template>

<script>
export default {
	props: {
		value: { type: Boolean, required: true },
	},
}
</script>

<style lang="sass">
.switch-bg
	width: 34px
	height: 18px
	padding: 2px
	border-radius: 18px
	background-color: rgba(255,255,255,0.1)
	cursor: pointer
	transition: all 0.2s ease
	.switch-circle
		position: relative
		left: 0
		transition: inherit
		height: 14px
		width: 14px
		border-radius: 18px
		background-color: rgba(255,255,255,0.3)
	&.switch-on
		background-color: rgba(255,255,255,0.5)
		.switch-circle
			left: 16px
			background-color: rgba(255,255,255,1)
</style>
