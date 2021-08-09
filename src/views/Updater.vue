<template>
	<div class="content">
		<p>{{text}}</p>

		<div class="infos">
			<i :class="iconClass"></i>
			<p class="percent">{{percent}}%</p>
			<p class="close">X</p>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue'

export default {
	setup() {
		const percent = ref(56)
		const text = ref('Looking for an update')
		const iconClass = ref('icon')

		return { percent, text, iconClass }
	}
}
</script>

<style lang="sass">
.content
	display: flex
	justify-content: space-between
	align-items: center
	height: 100vh
	padding: 0 30px
	font-weight: 500
	font-size: 14px
	user-select: none

.progressbar
	position: absolute
	top: 0
	left: 0
	bottom: 0
	width: 25%
	background-color: #fff
	&-container
		position: absolute
		top: 0
		left: 0
		bottom: 0
		right: 0
		opacity: 0.15
		padding-left: 5%
		&::before
			content: ''
			position: absolute
			top: 0
			left: 0
			bottom: 0
			width: 5%
			background-color: #fff


</style>