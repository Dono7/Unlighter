export default {
	namespaced: true,
	state: () => ({
		isOpen: false,
	}),
	mutations: {
		toggleMenu(state) {
			state.isOpen = !state.isOpen
		},
	},
}
