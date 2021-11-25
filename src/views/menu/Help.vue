<script setup>
import { ref } from "vue"
import InputBlock from "@/components/InputBlock"

const pref = ref([
	{
		key: "decrease",
		label: "Decrease filters by 5",
		inputType: "showString",
		text: "Alt+F2",
	},
	{
		key: "increase",
		label: "Increase filters by 5",
		inputType: "showString",
		text: "Alt+F3",
	},
])
</script>

<template>
	<main class="help">
		<h2>Multi-Drag</h2>

		<img src="@/assets/gif/multidrag.gif" />

		<p class="description">
			Clic and drag throught multiple monitors bar to synchronise them.
		</p>

		<h2>Shortcuts</h2>

		<InputBlock v-for="p in pref" :name="p.key" v-bind="p" smallmargin />
	</main>
</template>

<style lang="sass" scoped>
.description
  margin: 4px 0 16px
</style>
