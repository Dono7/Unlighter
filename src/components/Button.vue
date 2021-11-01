<script setup>
import { computed } from "vue"

const props = defineProps({
	label: { type: String, required: false, default: "" },
	iconClass: { type: String, required: false, default: "" },
	centered: { type: Boolean, required: false, default: false },
	href: { type: String, required: false },
	small: { type: Boolean, required: false },
	notif: { type: Boolean, required: false },
	size: { type: Number, required: false },
	iconSize: { type: Number, required: false },
	iconPath: { type: String, required: false },
})

const openUrl = () => {
	if (props.href) {
		window.unlighter.openUrl(props.href)
	}
}

const buttonStyle = computed(() => {
	return !props.size
		? {}
		: {
				height: props.size + "px",
				width: props.size + "px",
		  }
})

const iconStyle = computed(() => {
	return !props.iconSize
		? {}
		: {
				height: props.iconSize + "px",
				width: props.iconSize + "px",
		  }
})
</script>

<template>
	<button :class="{ centered, small, notif, size }" @click="openUrl" :style="buttonStyle">
		{{ label }}
		<i v-if="iconClass" :class="iconClass"></i>
		<img v-if="iconPath" :src="require(`@/assets/${iconPath}`)" :style="iconStyle" />
	</button>
</template>

<style lang="sass">
button
	border-radius: 100px
	color: white
	padding: 10px 20px
	margin: 10px 0
	width: fit-content
	cursor: pointer
	transition: all 0.1s ease-in-out
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
		border: 2px solid rgba(255,255,255,0.5)
	&:active
		border: 2px solid rgba(255,255,255,1)
	&.size
		padding: 0
		margin: 0
		display: flex
		justify-content: center
		align-items: center
</style>
