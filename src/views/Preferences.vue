<template>
	<main class="preferences">
		<InputBlock
			v-for="p in pref"
			:name="p.key"
			v-bind="p"
			@valuechange="(...args) => this.changePref(p.key, ...args)"
		/>
	</main>
</template>

<script>
import { onBeforeMount, onUnmounted, ref } from "vue"
import InputBlock from "./../components/InputBlock"
import Button from "./../components/Button"

export default {
	components: { InputBlock, Button },
	name: "Preferences",
	setup(props) {
		const changePref = (key, value) => {
			window.unlighter.execModuleMethod({
				module: "Prefs",
				method: "setPref",
				args: [key, value],
			})
		}

		const pref = ref([
			{
				key: "screenStrength",
				label: "Default filters strength on start",
				value: 9,
				inputType: "number",
				min: 0,
				max: 100,
			},
			{
				key: "showScreenNumber",
				label: "Show screen number",
				value: true,
				inputType: "switch",
			},
			{
				key: "minimizeOnBlur",
				label: "Automatically minimize",
				value: true,
				inputType: "switch",
			},
			{
				key: "enableShortcuts",
				label: "Enable shortcuts",
				value: true,
				inputType: "switch",
			},
			{
				key: "showInTaskbar",
				label: "Show in taskbar",
				value: true,
				inputType: "switch",
			},
			{
				key: "searchUpdateOnStartup",
				label: "Check for an update when app starts",
				value: true,
				inputType: "switch",
			},
		])

		onBeforeMount(() => {
			window.unlighter.on("preferences-get", (event, userPref) => {
				pref.value.forEach((p) => {
					if (userPref[p.key] !== undefined) {
						p.value = userPref[p.key]
					}
				})
			})

			window.unlighter.execModuleMethod({
				module: "Pcc",
				method: "sendToPccFromCode",
				args: ["preferences-get"],
			})
		})

		onUnmounted(() => {
			window.unlighter.removeListener("preferences-get")
		})

		return { pref, changePref }
	},
}
</script>

<style lang="sass"></style>
