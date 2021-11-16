<script setup>
import { onMounted, ref } from "vue"

const emit = defineEmits(["animation-end"])

const container = ref()
const delayBeforeClose = 1000

onMounted(() => {
	container.value.addEventListener("animationend", (event) => {
		if (event.target == container.value) {
			setTimeout(() => {
				emit("animation-end")
			}, delayBeforeClose)
		}
	})
})
</script>

<template>
	<div class="logo-animation-container" ref="container">
		<div class="icon">
			<img src="@/assets/svg/icon-rays.svg" class="rays" />
			<div class="sun-mask">
				<div class="sun"></div>
			</div>
		</div>
		<h1>Unlighter</h1>
	</div>
</template>

<style scoped lang="sass">
$anim-delay: 0.5s
$anim-fun1: cubic-bezier(0.05, 0.24, 0.35, 1)
$anim-fun2: cubic-bezier(0.89, 0, 0.84, 0.66)

$anim-param1: 0.6s $anim-fun1 ($anim-delay) 1 forwards
$anim-param2: 0.3s $anim-fun2 ($anim-delay + 0.6s + 0.2s) 1 forwards
$anim-param3: 0.35s $anim-fun1 ($anim-delay + 0.9s + 0.2s) 1 forwards

@mixin img-size
	width: 70px
	height: 70px

@mixin absolute-center
	position: absolute
	top: 50%
	left: 50%
	transform: translate(-50%, -50%)

.logo-animation-container
	position: relative
	top: 16px
	display: flex
	flex-direction: column
	justify-content: center
	align-items: center
	animation: container-move $anim-param3
	.icon
		display: flex
		justify-content: center
		align-items: center
		position: relative
		@include img-size
		img.rays
			@include absolute-center
			@include img-size
			opacity: 0
			animation: opa $anim-param1
		.sun-mask
			@include absolute-center
			@include img-size
			overflow: hidden
			height: 40px
			width: 40px
			border-radius: 40px
			.sun
				position: relative
				height: 40px
				width: 40px
				border-radius: 40px
				top: 0
				opacity: 0
				background: #6787ee
				animation: opa $anim-param1, sun-size $anim-param1, sun-move $anim-param2
	h1
		text-align: center
		padding: 0
		margin-top: 24px
		font-size: 14px
		letter-spacing: 0.6px
		font-weight: 500
		opacity: 0
		animation: opa $anim-param3, between-txt-icon $anim-param3,

@keyframes opa
	0%
		opacity: 0
	100%
		opacity: 1

@keyframes sun-size
	0%
		transform: scale(0.77)
	100%
		transform: scale(1)

@keyframes sun-move
	0%
		top: 0
	100%
		top: 50%

@keyframes between-txt-icon
	0%
		margin-top: 24px
	100%
		margin-top: 16px

@keyframes container-move
	0%
		top: 16px
	100%
		top: 0px
</style>
