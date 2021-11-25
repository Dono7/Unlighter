const windowWith = 320

export const clamp = (num, min, max) => {
	return num > max ? max : num < min ? min : num
}

export default {
	namespaced: true,
	state: () => ({
		list: [
			{ id: 1, index: 0, str: 0, name: "Loading...", isActive: false },
			{ id: 2, index: 1, str: 0, name: "Loading...", isActive: false },
			{ id: 3, index: 2, str: 0, name: "Loading...", isActive: false },
			{ id: 4, index: 3, str: 0, name: "Loading...", isActive: false },
		],
		lastMouseXPosition: 0,
	}),
	mutations: {
		list(state, { list }) {
			// This mutation should only be called when initialising app or reloading filters
			// Do not use this mutation outside of the Store Handler
			const newList = state.list.map((monitor, index) => {
				const detectedMonitor = list[index]
				return {
					id: detectedMonitor?.id ?? monitor.id,
					index: index,
					str: detectedMonitor?.str ?? monitor.str,
					name: detectedMonitor?.name ?? "Monitor " + (index + 1),
					isActive: false,
					isDetected: !!detectedMonitor?.id,
				}
			})

			state.list = newList
		},
		setActive(state, index) {
			state.list[index].isActive = true
		},
		setAllInactive(state) {
			state.list.forEach((m) => (m.isActive = false))
		},
		setStr(state, { newStr, index }) {
			state.list[index].str = newStr
		},
		lastMouseXPosition(state, lastMouseXPosition) {
			state.lastMouseXPosition = lastMouseXPosition
		},
		addValueToAll(state, valueToAdd) {
			state.list.forEach((m) => {
				m.str = clamp(m.str + valueToAdd, 0, 100)
			})
		},
	},
	getters: {
		isSomeoneActive(state) {
			return state.list.some((monitor) => monitor.isActive)
		},
		getList(state) {
			return state.list
		},
		lastRelativeMouseXPosition(state) {
			const factor = windowWith / 100
			const x = Math.round((state.lastMouseXPosition / factor) * 100) / 100
			return x < 1 ? 0 : x > 99 ? 100 : x
		},
		listForFilters(state) {
			return state.list
				.filter((monitor) => monitor.isDetected)
				.map((monitor) => {
					const str = monitor.str
					const textOpacity = Math.max(0.3, Math.min(1 - str / 100, 1))
					const bgOpacity = (str / 100) * 0.95
					return {
						str,
						textColor: `rgba(250,250,250,${textOpacity})`,
						bgc: `rgba(0,0,0,${bgOpacity})`,
					}
				})
		},
	},
}
