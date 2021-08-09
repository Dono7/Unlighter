<template>
	<button :class="{centered, small}" @click="openUrl">{{label}}</button>
</template>

<script>
export default {
	props: {
		label: { type: String, required: false, default: ''},
		centered: { type: Boolean, required: false, default: false},
		href: { type: String, required: false},
		small: { type : Boolean, required: false}
	},
	setup(props) {
		const openUrl = () => {
			if(props.href) {
				window.unlighter.openUrl(props.href)
			}
		}

		return { openUrl }
	}
}
</script>

<style lang="sass">
$purple: #7587FF

button
	background-color: white
	border-radius: 100px
	color: black
	padding: 10px 20px
	margin: 10px 0
	width: fit-content
	cursor: pointer
	transition: all 0.2s ease-in-out
	font-weight: 500
	font-size: 12px
	border: none
	outline: none
	&.centered
		margin: auto
</style>