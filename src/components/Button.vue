<template>
	<button :class="{centered, small}" @click="openUrl">{{label}}</button>
</template>

<script>
export default {
	props: {
		label: { type: String, required: false, default: ''},
		centered: { type: Boolean, required: false, default: false},
		url: { type: String, required: false},
		small: { type : Boolean, required: false}
	},
	setup(props) {
		const openUrl = () => {
			if(props.url) {
				window.unlighter.openUrl(props.url)
			}
		}

		return { openUrl }
	}
}
</script>

<style lang="sass">
$purple: #7587FF

button
	background-color: rgba(255,255,255,0.1)
	border: 1px solid $purple
	border-radius: 8px
	color: white
	padding: 6px 12px
	width: fit-content
	cursor: pointer
	transition: all 0.2s ease-in-out
	&:hover
		background-color: $purple
	&:focus
		outline: none
	&.centered
		margin: auto
	&.small
		padding: 4px 8px
</style>