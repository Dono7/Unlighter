<script setup>
defineProps({
	value: { type: Boolean, required: true },
})
</script>

<template>
	<div class="switch-bg" :class="{ 'switch-on': value }" @click="$emit('valuechange')">
		<div class="switch-circle"></div>
	</div>
</template>

<style lang="sass">
.switch-bg
	width: 40px
	height: 20px
	padding: 2px
	border-radius: 20px
	border: 1px solid $input-border-color
	cursor: pointer
	transition: all 0.2s ease
	.switch-circle
		position: relative
		left: 0
		transition: inherit
		height: 14px
		width: 14px
		border-radius: 20px
		background-color: $input-border-color
	&.switch-on
		.switch-circle
			left: 19px
			background-color: white
</style>
