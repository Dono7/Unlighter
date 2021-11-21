export default {
	namespaced: true,
	state: () => ({
		list: [
			{ id: 1, index: 0, str: 0, barPosition: 0, name: "Loading...", isActive: false },
			{ id: 2, index: 1, str: 0, barPosition: 0, name: "Loading...", isActive: false },
			{ id: 3, index: 2, str: 0, barPosition: 0, name: "Loading...", isActive: false },
			{ id: 4, index: 3, str: 0, barPosition: 0, name: "Loading...", isActive: false },
		],
	}),
	mutations: {
		list(state, list) {
			state.list = list
		},
	},
}
