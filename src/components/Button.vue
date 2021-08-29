<template>
	<button :class="{centered, small, notif}" @click="openUrl">
		{{label}}
		<i v-if="iconClass" :class="iconClass"></i>	
	</button>
</template>

<script>
export default {
	props: {
		label: { type: String, required: false, default: ''},
		iconClass: { type: String, required: false, default: ''},
		centered: { type: Boolean, required: false, default: false},
		href: { type: String, required: false},
		small: { type : Boolean, required: false},
		notif: { type : Boolean, required: false},
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
	border-radius: 100px
	color: white
	padding: 10px 20px
	margin: 10px 0
	width: fit-content
	cursor: pointer
	transition: all 0.2s ease-in-out
	font-weight: 500
	font-size: 12px
	background: rgba(255, 255, 255, 0)
	border: 2px solid rgba(255, 255, 255, 0.2)
	outline: none
	&.centered
		margin: auto
	&.small
		padding: 4px 20px
	&:hover
		background: rgba(255, 255, 255, 0.2)
		border: 2px solid rgba(255, 255, 255, 0)
</style>