<script setup>
import { ref, computed } from "vue"
import { useStore } from "vuex"

const store = useStore()

const tabs = ref([
	{ label: "Monitors", to: "Monitors" },
	{ label: "Preferences", to: "Preferences" },
	{ label: "About", to: "About" },
	{ label: "Help", to: "Help" },
])

const updateAvailable = computed(() => store.state.app.updateAvailable)
</script>

<template>
	<div class="navbar">
		<router-link
			v-for="tab in tabs"
			:key="tab"
			href="#"
			:to="{ name: tab.to }"
			:class="{ notif: tab.label == 'About' && !!updateAvailable }"
		>
			{{ tab.label }}
		</router-link>
	</div>
</template>

<style lang="sass">
@import '@/assets/sass/variables.sass'

.navbar
	display: flex
	justify-content: space-between
	padding: 0 30px
	align-items: center
	width: 100%
	height: 65px
	margin-bottom: 24px
	letter-spacing: 0.6px
	a
		text-decoration: none
		color: white
		transition: all 0.1s
		font-weight: 500
		letter-spacing: 0
		font-size: 12px
		position: relative
		&:hover, &.router-link-exact-active
			color: $primary
</style>
