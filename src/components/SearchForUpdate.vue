<script setup>
import Button from "@/components/Button"
import { useStore } from "vuex"
import { computed } from "vue"

const store = useStore()

const lastUpdateCheckString = computed(() => store.state.app.lastUpdateCheckString)
const updateAvailable = computed(() => store.state.app.updateAvailable)
const label = computed(() =>
	updateAvailable.value ? "Update available" : "Search for update",
)

const comment = computed(() =>
	updateAvailable.value
		? `upgrade to ${updateAvailable.value}`
		: `Last check ${lastUpdateCheckString.value}`,
)

const iconPath = computed(() =>
	updateAvailable.value ? "svg/download.svg" : "svg/check-update.svg",
)
</script>

<template>
	<div id="search-for-update">
		<div class="update-text">
			<h4>{{ label }}</h4>
			<p v-if="lastUpdateCheckString" class="comment">{{ comment }}</p>
		</div>
		<Button :size="44" :iconPath="iconPath" :iconSize="14" :notif="updateAvailable" />
	</div>
</template>

<style lang="sass" scoped>
#search-for-update
	display: flex
	justify-content: space-between
	align-items: center
	margin-bottom: 10px
	h4
		font-size: 16px
		font-weight: 500
	p.comment
		font-size: 11px
</style>
