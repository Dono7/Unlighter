<script setup>
import NavBar from "../components/NavBar.vue"
</script>

<template>
	<div class="menu-container">
		<NavBar />
		<router-view></router-view>
	</div>
</template>

<style lang="sass" scoped>
.menu-container
	position: absolute
	top: 0
	left: 0
	height: 100%
	width: 100%
	max-height: 100%
	background: $background
	overflow: hidden
	z-index: 5
</style>
