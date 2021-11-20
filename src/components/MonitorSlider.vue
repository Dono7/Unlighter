<script setup>
defineProps({
	screen: { type: Object, required: true },
	index: { type: Number, required: true },
})
</script>

<template>
	<div
		class="monitor-container"
		:class="{ active: screen.isActive, disabled: !screen.isDetected }"
	>
		<div class="progressbar" :style="{ width: screen.str + '%' }"></div>
		<div class="monitor-name">
			{{ screen.name ? `${screen.name}` : `Monitor ${index + 1}` }}
		</div>
		<div class="pourcentage">
			{{ screen.isDetected ? Math.round(screen.str) + " %" : "Not detected" }}
		</div>
	</div>
</template>

<style lang="sass" scoped>
.monitor-container
	position: relative
	display: flex
	justify-content: space-between
	align-items: center
	padding: 0 28px
	height: 75px
	font-weight: 500
	cursor: url('./../assets/svg/cursor_hover.svg') 13.5 6, pointer
	font-size: 12px
	.progressbar
		position: absolute
		top: 0
		bottom: 0
		left: 0
		width: 0%
		background-color: $slider-bgc
		&::before
			content: ''
			position: absolute
			top: 0
			bottom: 0
			right: 0
			width: 130px
			opacity: 0
			transition: opacity 0.3s ease
			background: linear-gradient(90deg, rgba(150, 164, 255, 0) 0%, rgba(150, 164, 255, 0.2) 100%)
	&:hover
		.progressbar::before
			opacity: 0.5
	&.active
		.progressbar
			border-right: 2px solid $primary
			&::before
				opacity: 1
	&.disabled
		background: $slider-disabled-bgc
		color: $slider-disabled-font-color
		cursor: default
		.progressbar
			display: none
</style>
