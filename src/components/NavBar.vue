<template>
	<div class="navbar">
		<router-link v-for="tab in tabs" :key="tab" href="#" :to="{ name: tab.to }" :class="{notif: tab.notif}">
			{{tab.label}}
		</router-link>
	</div>
</template>

<script>
import { onBeforeMount, ref } from 'vue'

export default {
	setup() {
		const tabs = ref([
			{label: 'Monitors', to: 'Monitors'},
			{label: 'Preferences', to: 'Preferences'},
			{label: 'About', to: 'About', notif: false},
			{label: 'Help', to: 'Help'},
		])

		onBeforeMount(() => {
			window.unlighter.once('update-available', () => {
				tabs.value.forEach(t => {
					if(t.label == 'About') {
						t.notif = true
					}
				})
			})
		})
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
		&:hover, &.router-link-exact-active
			color: $primary


</style>