<template>
	<div class="container">
		<div class="update-text">
			<h4>{{ label }}</h4>
			<p>{{ comment }}</p>
		</div>
		<Button :size="44" :iconPath="iconPath" :iconSize="14" :notif="updateAvailable"/>
	</div>
</template>

<script>
import Button from '@/components/Button'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
	components: { Button },
	setup() {
		const store = useStore()
 
		const updateAvailable = computed(() => store.state.app.updateAvailable)
		const label = computed(() => updateAvailable.value ? 'Update available' : 'Search for update')
		const comment = computed(() => updateAvailable.value ? `upgrade to ${updateAvailable.value}` : '')
		const iconPath = computed(() => updateAvailable.value ? 'svg/download.svg' : 'svg/check-update.svg')

		return { updateAvailable, label, comment, iconPath }
	}
}
</script>

<style lang="sass" scoped>
.container
	display: flex
	justify-content: space-between
	align-items: center
	margin: 10px 0
	h4
		font-size: 16px
		font-weight: 500
	p
		font-size: 11px
</style>