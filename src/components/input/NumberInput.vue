<template>
	<input 
		type="text"
		v-model="value"
		@change="onValueChange"
		@keypress.enter="$event.target.blur()"
	/>
</template>

<script>
export default {
	props: {
		value: { type: Number, required: true },
		min: { type: Number, required: false },
		max: { type: Number, required: false }
	},
	setup(props, { emit }) {

		const onValueChange = () => {
			if(props.min && +props.value < props.min) {
				props.value = props.min
			}
			if(props.max && +props.value > props.max) {
				props.value = props.max
			}
			if(props.value == '' || (props.value.length > 1 && +props.value == 0)) {
				props.value = 0
			}
			emit('valuechange', +props.value)
		}

		return { onValueChange }
	}
}
</script>

<style lang="sass">
input
	text-align: center
	width: 34px
	height: 24px
	border: none
	color: white
	border-radius: 4px
	transition: all 0.2s ease
	background-color: rgba(255,255,255,0.1)
	&:focus, &:hover
		background-color: rgba(255,255,255,0.3)
		outline: none

</style>