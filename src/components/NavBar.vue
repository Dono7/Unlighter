<template>
	<div class="navbar">
		<router-link v-for="tab in tabs" :key="tab" href="#" :to="{ name: tab.to }">
			{{tab.label}}
		</router-link>
	</div>
</template>

<script>
import { ref } from 'vue'

export default {
	setup() {
		const tabs = ref([
			{label: 'Monitors', to: 'Monitors'},
			{label: 'Preferences', to: 'Preferences'},
			{label: 'About', to: 'About'},
			// {label: 'Contact', to: 'Contact'},
		])
		return { tabs }
	}
}
</script>

<style lang="sass">
.navbar
	display: flex
	justify-content: space-evenly
	align-items: center
	width: 100%
	height: 65px
	border-width: 1px 0
	border-color: rgba(255,255,255,0.2)
	border-style: solid
	margin-bottom: 24px
	a 
		text-decoration: none
		color: #666
		transition: all 0.1s
		font-weight: 500
		letter-spacing: 0
		font-size: 12px
		&:hover, &.router-link-exact-active
			color: #fff

</style>