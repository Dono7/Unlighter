const app = {
	namespaced: true,
	state: () => ({
		version: "",
	}),
	mutations: {
		setVersion(state, version) {
			state.version = version
		},
	},
}
