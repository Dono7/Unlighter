<script setup>
const props = defineProps({
	label: { type: String, required: false, default: "" },
	href: { type: String, required: false, default: "#" },
})

const openUrl = () => {
	if (props.href) {
		window.unlighter.openUrl(props.href)
	}
}
</script>

<template>
	<a :href="href" @click.prevent="openUrl">{{ label }}</a>
</template>

<style scoped lang="sass">
@import '@/assets/sass/variables.sass'

a
	color: $primary
</style>
