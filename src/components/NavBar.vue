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
		&:hover
			color: $primary
		&::before
			content: ''
			width: 5px
			height: 5px
			border-radius: 5px
			background-color: $primary
			position: absolute
			bottom: -12px
			left: 50%
			transition: all 0.25s
			transform: translateX(-50%) scale(0)
		&.router-link-exact-active
			color: $primary
			&::before
				transform: translateX(-50%) scale(1)

</style>