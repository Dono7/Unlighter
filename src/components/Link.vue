<script setup lang="ts">
const props = defineProps({
	href: { type: String, required: false, default: "#" },
})

const openUrl = () => {
	if (props.href) {
		window.unlighter.openUrl(props.href)
	}
}
</script>

<template>
	<a :href="href" @click.prevent="openUrl">
		<slot></slot>
	</a>
</template>

<style lang="sass" scoped>
a
	color: $primary
</style>
