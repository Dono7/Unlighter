<script setup>
defineProps({
	text: { type: String, default: "" },
})
</script>

<template>
	<p>{{ text }}</p>
</template>

<style lang="sass" scoped>
p
	margin: 0
	padding: 6px 10px
	border-radius: 4px
	background-color: rgba(255,255,255,0.1)
</style>
