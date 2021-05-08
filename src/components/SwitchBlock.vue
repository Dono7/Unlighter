<template>
	<div class="switch-block">
		<div class="switch-label" :style="labelMaxWidth ? `max-width: ${labelMaxWidth}px` : ''">{{label}}</div>
		<!-- <div class="switch">{{ value ? 'on' : 'off' }}</div> -->
		<Switch :value="value" @valuechange="value = !value; $emit('valuechange', value)"/>
	</div>
</template>

<script>
import Switch from './input/Switch'

export default {
	components: { Switch },
	props: {
			value: { type: Boolean, required: true },
			name: { type: String, required: true },
			label: { type: String, required: true },
			labelMaxWidth: {type: Number, required: false, default: 135},
	},
}
</script>

<style lang="sass">
.switch-block
	display: flex
	align-items: center
	justify-content: space-between
	.switch-label
		font-size: 12px

</style>