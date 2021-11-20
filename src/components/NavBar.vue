<script setup>
import { ref, computed } from "vue"
import { useStore } from "vuex"

const store = useStore()

const tabs = ref([
	{ label: "Preferences", to: "Preferences" },
	{ label: "Update", to: "Update" },
	{ label: "About", to: "About" },
	{ label: "Help", to: "Help" },
])

const updateAvailable = computed(() => store.state.app.updateAvailable)
</script>

<template>
	<nav>
		<router-link
			v-for="tab in tabs"
			:key="tab"
			href="#"
			:to="{ name: tab.to }"
			:class="{ notif: tab.label == 'About' && !!updateAvailable }"
		>
			{{ tab.label }}
		</router-link>
	</nav>
</template>

<style lang="sass" scoped>
nav
	display: flex
	justify-content: space-between
	padding: 28px
	align-items: center
	width: 100%
	height: 65px
	letter-spacing: 0.6px
	a
		text-decoration: none
		color: white
		transition: all 0.1s
		font-weight: 500
		letter-spacing: 0
		font-size: 11px
		position: relative
		opacity: 0.3
		&:hover, &.router-link-exact-active
			opacity: 1
</style>
