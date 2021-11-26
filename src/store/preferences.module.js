export default {
	namespaced: true,
	state: () => ({
		prefs: [
			{
				key: "screenStrength",
				label: "Default filters strength",
				comment: "When app starts",
				value: 9,
				inputType: "number",
				min: 0,
				max: 100,
			},
			{
				key: "minimizeOnBlur",
				label: "Automatically minimize",
				comment: "When click outside",
				value: true,
				inputType: "switch",
			},
			{
				key: "enableShortcuts",
				label: "Enable shortcuts",
				comment: "Alt+F2 / Alt+F3",
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
				key: "showScreenNumber",
				label: "Show screen number",
				value: true,
				inputType: "switch",
			},
		],
		showConfirmation: false,
		showConfirmationTimeout: null,
		showConfirmationDuration: 1250,
	}),
	mutations: {
		setPrefs(state, prefs) {
			const newPrefs = state.prefs.map((p) => {
				if (prefs[p.key] !== undefined) {
					p.value = prefs[p.key]
				}
				return p
			})
			state.prefs = newPrefs
		},
		changePref(state, { key, value }) {
			state.prefs.forEach((p) => {
				if (p.key == key) {
					p.value = value
				}
			})
			state.showConfirmation = false
			window.unlighter.execModuleMethod({
				module: "Prefs",
				method: "setPref",
				args: [key, value],
			})
		},
		prefChangedConfirmation(state) {
			state.showConfirmation = true

			if (state.showConfirmationTimeout) {
				clearTimeout(state.showConfirmationTimeout)
			}

			state.showConfirmationTimeout = setTimeout(() => {
				state.showConfirmation = false
				state.showConfirmationTimeout = null
			}, state.showConfirmationDuration)
		},
	},
}
