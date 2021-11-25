<script setup>
import { ref } from "vue"

const props = defineProps({
	value: { type: Number, required: true },
	min: { type: Number, required: false },
	max: { type: Number, required: false },
})

const v = ref(props.value)

const emit = defineEmits(["valuechange"])

const onValueChange = () => {
	if (props.min !== undefined && props.max !== undefined) {
		v.value = Math.min(props.max, Math.max(props.min, v.value))
	}
	emit("valuechange", v.value)
}
</script>

<template>
	<input
		type="number"
		v-model.number="v"
		:min="min"
		:max="max"
		@change="onValueChange"
		@keypress.enter="$event.target.blur()"
	/>
</template>

<style lang="sass" scoped>
input
	text-align: center
	width: 64px
	height: 38px
	color: white
	background: transparent
	border-radius: 100px
	border: 1px solid $input-border-color
	transition: all 0.2s ease
	&:focus, &:hover
		outline: none
		border-color: $input-border-color-focus

	// Hide ugly arrows
	&::-webkit-outer-spin-button, &::-webkit-inner-spin-button
		-webkit-appearance: none
</style>
