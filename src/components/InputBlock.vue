<script setup lang="ts">
import Switch from "./input/Switch.vue"
import NumberInput from "./input/NumberInput.vue"
import ShowString from "./input/ShowString.vue"

const props = defineProps({
	value: { type: [Boolean, Number], required: false },
	min: { type: Number, required: false },
	max: { type: Number, required: false },
	name: { type: String, required: true },
	label: { type: String, required: true },
	comment: { type: String, default: "" },
	inputType: { type: String, required: true },
	text: { type: String, required: false },
	labelMaxWidth: { type: Number, required: false, default: 145 },
	smallmargin: { type: Boolean, required: false },
})
</script>

<template>
	<div class="input-block" :class="{ smallmargin }">
		<div
			class="input-label"
			:style="labelMaxWidth ? `max-width: ${labelMaxWidth}px` : ''"
		>
			<label>{{ label }}</label>
			<span v-if="comment" class="comment">{{ comment }}</span>
		</div>
		<Switch
			v-if="typeof value === 'boolean' && inputType == 'switch'"
			:value="value"
			@valuechange="
				() => {
					value = !value
					$emit('valuechange', value)
				}
			"
		/>
		<NumberInput
			v-if="typeof value === 'number' && inputType === 'number'"
			:value="value"
			:min="min"
			:max="max"
			@valuechange="(...value) => $emit('valuechange', ...value)"
		/>
		<ShowString v-if="inputType == 'showString'" :text="text" />
	</div>
</template>

<style lang="sass" scoped>
.input-block
	box-sizing: border-box
	display: flex
	align-items: center
	justify-content: space-between
	margin-bottom: 15px
	&.smallmargin
		margin-bottom: 10px
	.input-label
		font-size: 11px
	.comment
		display: block
		opacity: 0.4
</style>
