<script setup>
defineProps({
	screen: { type: Object, required: true },
	index: { type: Number, required: true },
})
</script>

<template>
	<div class="monitor-container" :class="{ active: screen.isActive }">
		<div class="progressbar" :style="{ width: screen.str + '%' }"></div>
		<div class="monitor-name">
			{{ screen.name ? `${screen.name}` : `Monitor ${index + 1}` }}
		</div>
		<div class="pourcentage">{{ Math.round(screen.str) }}</div>
	</div>
</template>

<style lang="sass" scoped>
@import '@/assets/sass/variables.sass'

$border-size: 2px
.monitor-container
	position: relative
	display: flex
	justify-content: space-between
	align-items: center
	padding: 0 30px
	height: 75px
	font-weight: 500
	cursor: url('./../assets/svg/cursor_hover.svg') 13.5 6, pointer
	border-color: rgba(255,255,255,0.2)
	border-style: solid
	border-width: 0
	font-size: 12px
	.progressbar
		position: absolute
		top: 0
		bottom: 0
		left: 0
		width: 0%
		background-color: $secondary
		&::before
			content: ''
			position: absolute
			left: 0
			bottom: 0
			width: 100%
			height: $border-size
			background: $primary
	&.active
		.progressbar
			border-right: 1px solid rgba(255,255,255,0.7)
	&::before
		content: ''
		position: absolute
		left: 0
		bottom: 0
		width: 100%
		height: $border-size
		background: rgba(255,255,255,0.1)
</style>
