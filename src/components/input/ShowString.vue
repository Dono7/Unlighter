<template>
	<p>{{text}}</p>
</template>

<script>
export default {
	props: {
		text: { type: String, default: '' }
	}
}
</script>

<style lang="sass" scoped>
p
	margin: 0
	padding: 6px 10px
	border-radius: 4px
	background-color: rgba(255,255,255,0.1)
</style>