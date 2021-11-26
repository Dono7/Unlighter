<script setup>
import { computed } from "vue"
import InputBlock from "@/components/InputBlock"
import { useStore } from "vuex"

const store = useStore()

const changePref = (key, value) => {
	store.commit("preferences/changePref", { key, value })
}

const showConfirmation = computed(() => store.state.preferences.showConfirmation)

const prefs = computed(() => store.state.preferences.prefs)
</script>

<template>
	<main class="preferences">
		<InputBlock
			v-for="p in prefs"
			:name="p.key"
			v-bind="p"
			@valuechange="(...args) => changePref(p.key, ...args)"
		/>

		<transition name="fade">
			<div v-if="showConfirmation" class="changes-saved">
				<img src="@/assets/svg/checked.svg" alt="Checked changes saved" />
				Changes saved.
			</div>
		</transition>
	</main>
</template>

<style lang="sass" scoped>
.changes-saved
	position: absolute
	bottom: 28px
	color: $valid
	font-size: 11px
</style>
