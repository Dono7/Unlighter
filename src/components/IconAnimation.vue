<template>
	<div class="logo-animation-container">
		<div class="icon">
			<img src="@/assets/svg/icon-colored-rays.svg" class="rays">
			<div class="sun-mask">
				<div class="sun"></div>
			</div>
			<h1>Unlighter</h1>
		</div>
	</div>
</template>

<script>
export default {

}
</script>

<style scoped lang="sass">
@import '@/assets/sass/variables.sass'
$anim-func: ease-in-out
$anim-delay: 0s
$anim-dur: 1.5s

.logo-animation-container
	position: relative
	top: 30px
	display: flex
	justify-content: center
	animation: container $anim-dur $anim-func $anim-delay 1 forwards
	h1
		text-align: center
		padding: 0
		margin-top: 15px
		font-size: 18px
		letter-spacing: 0.6px
		font-weight: 500
		opacity: 0
		animation: text $anim-dur $anim-func $anim-delay 1 forwards
	.icon
		position: relative
		width: 100px
		height: 100px
		img.rays
			width: inherit
			height: inherit
			opacity: 0
			animation: rays $anim-dur $anim-func $anim-delay 1 forwards
		.sun-mask
			position: absolute
			top: 50%
			left: 50%
			transform: translate(-50%, -50%)
			width: 48%
			height: 48%
			border-radius: 320px
			overflow: hidden
			.sun
				position: relative
				top: 0
				width: 100%
				height: 100%
				border-radius: 320px
				background-color: $primary
				transform: scale(0.8)
				opacity: 0
				animation: sun $anim-dur $anim-func $anim-delay 1 forwards

@keyframes rays
	0%
		opacity: 0
	50%, 100%
		opacity: 1

@keyframes text
	0%, 75%
		opacity: 0
	100%
		opacity: 1

@keyframes sun
	10%
		transform: scale(0.8)
		opacity: 0
	30%, 100%
		transform: scale(1)
		opacity: 1
	65%
		top: 0
	90%, 100%
		top: 20px

@keyframes container
	0%, 75%
		top: 30px
	100%
		top: 0
	
</style>