<script setup>
import { computed, ref } from "@vue/reactivity"
import store from "../store"

const opened = computed(() => store.state.menu.isOpen)
</script>

<template>
	<div class="menu-opener" :class="{ opened }">
		<div class="dots-container">
			<div class="left"></div>
			<div class="stick-left"></div>
			<div class="central"></div>
			<div class="stick-right"></div>
			<div class="right"></div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
$space-between-dots: 3px
$dot-radius: 4px
$dot-scale: 0.8
$dot-y-axis-shift: 2.5px
$stick-length: 12px
$stick-height: 2px
$semi-dot-radius: $dot-radius / 2
$semi-stick-height: $stick-height / 2

// Transitions : Become Arrow (dots)
$t-top: top 0.07s ease-in-out
$t-transform: transform 0.14s 0.18s ease-in-out

// Transitions : Become Arrow (Sticks)
$ts-transform: transform 0s
$ts-width: width 0.08s 0.14s ease-in-out
$ts-radius: border-radius 0.35s 0.4s ease-in-out
$ts-height: height 0.07s 0.1s ease-in-out
$ts-origin: transform-origin 0.07s 0.1s ease-in-out // Same as height
$ts-opacity: opacity 0s 0.07s

// Transitions : Back to dots (Dots)
$tb-top: top 0s
$tb-transform: transform 0.1s 0.24s ease-in-out

// Transitions : Back to dots (Sticks)
$tbs-transform: transform 0.14s 0s ease-in-out
$tbs-top: top 0.14s ease-in-out
$tbs-opacity: opacity 0s 0.34s
$tbs-width: width 0.14s 0.2s ease-in-out
$tbs-height: height 0.14s 0.2s ease-in-out
$tbs-origin: transform-origin 0.14s 0.2s ease-in-out // Same as height
$tbs-radius: border-radius 0.07s 0.2s ease-in-out

.menu-opener
	-webkit-app-region: no-drag
	display: flex
	justify-content: center
	align-items: center
	width: 70px
	height: inherit
	background: transparent
	transition: $titlebar-btn-transition
	cursor: pointer
	.dots-container
		position: relative
		display: flex
		height: $dot-radius
		> div
			position: relative
			top: 0
			height: $dot-radius
			width: $dot-radius
			border-radius: $semi-dot-radius
			background-color: white
		.central
			transform: scale($dot-scale)
		.stick-left, .stick-right
			position: absolute
			left: $dot-radius
			top: 0
			height: $dot-radius
			width: $dot-radius
			border-radius: $semi-dot-radius
			background-color: white
			opacity: 0
			transform-origin: ($semi-dot-radius) ($semi-dot-radius)
		.stick-left
			transform: scale(1) rotate(180deg)
		.stick-right
			transform: scale(1) rotate(0deg)
		.right
			transform: scale($dot-scale) translateX($space-between-dots)
		.left
			transform: scale($dot-scale) translateX(-$space-between-dots)

	&:hover
		background: $titlebar-btn-hover-white
	&.opened
		.dots-container
			> div
				transition: $t-top, $t-transform
			.central
				transform: scale(0)
				top: -$dot-y-axis-shift
			.stick-left, .stick-right
				transition: $ts-transform , $ts-width, $ts-height, $ts-origin, $ts-radius, $ts-opacity
				width: $stick-length
				height: $stick-height
				top: -$dot-y-axis-shift
				transform-origin: ($semi-stick-height) ($semi-stick-height)
				border-radius: $semi-stick-height
				opacity: 1
			.stick-left
				transform: scale($dot-scale) rotate(135deg)
			.stick-right
				transform: scale($dot-scale) rotate(45deg)
			.right, .left
				top: $dot-y-axis-shift
			.right
				transform: scale(0) translateX($space-between-dots)
			.left
				transform: scale(0) translateX(-$space-between-dots)
	// Transition back to normal
	&:not(.opened)
		.dots-container
			.central, .left, .right
				transition: $tb-top, $tb-transform
			.stick-left, .stick-right
				transition: $tbs-top, $tbs-transform, $tbs-opacity, $tbs-width, $tbs-height, $tbs-origin, $tbs-radius
</style>
