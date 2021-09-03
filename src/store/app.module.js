export default {
	namespaced: true,
	state: () => ({
		version: null,
	}),
	mutations: {
		version(state, version) {
			state.version = version
		},
	},
}
