export default {
	namespaced: true,
	state: () => ({
		version: null,
		updateAvailable: null,
		lastUpdateCheckString: null,
	}),
	getters: {
		isUpToDate(state) {
			return !state.updateAvailable && state.lastUpdateCheckString !== null
		},
	},
	mutations: {
		version(state, version) {
			state.version = version
		},
		updateAvailable(state, version) {
			state.updateAvailable = version
		},
		lastUpdateCheckString(state, lastUpdateCheckString) {
			state.lastUpdateCheckString = lastUpdateCheckString
		},
	},
}
