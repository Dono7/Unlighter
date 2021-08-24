<template>
	<div class="input-block">
		<div class="input-label" :style="labelMaxWidth ? `max-width: ${labelMaxWidth}px` : ''">{{label}}</div>
		<Switch v-if="inputType == 'switch'" :value="value" @valuechange="value = !value; $emit('valuechange', value)"/>
		<NumberInput v-if="inputType == 'number'" :value="value" :min="min" :max="max" @valuechange="(...value) => $emit('valuechange', ...value)" />
		<ShowString v-if="inputType == 'showString'" :text="text" />
	</div>
</template>

<script>
import { onMounted } from 'vue'
import Switch from './input/Switch'
import NumberInput from './input/NumberInput'
import ShowString from './input/ShowString'

export default {
	components: { Switch, NumberInput, ShowString },
	props: {
			value: { type: [Boolean, Number], required: false },
			min: { type: Number, required: false },
			max: { type: Number, required: false },
			name: { type: String, required: true },
			label: { type: String, required: true },
			inputType: {type: String, required: true },
			text: {type: String, required: false },
			labelMaxWidth: {type: Number, required: false, default: 145},
	}
}
</script>

<style lang="sass">
.input-block
	display: flex
	align-items: center
	justify-content: space-between
	margin-bottom: 15px
	.input-label
		font-size: 12px

</style>