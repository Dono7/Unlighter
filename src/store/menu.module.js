export default {
	namespaced: true,
	state: () => ({
		isOpen: false,
		lastRouteNameOpened: "Preferences",
	}),
	mutations: {
		toggleMenu(state) {
			state.isOpen = !state.isOpen
		},
		menuRouteOpened(state, routeName) {
			state.lastRouteNameOpened = routeName
		},
	},
}
