const round = (number, precision) => {
	const factor = Math.pow(10, precision)
	return Math.round(number * factor) / factor
}

const barPositionFromStr = (str) => {
	return round((windowWith / 100) * str, 1)
}

const windowWith = 320

export default {
	namespaced: true,
	state: () => ({
		list: [
			{ id: 1, index: 0, str: 0, barPosition: 0, name: "Loading...", isActive: false },
			{ id: 2, index: 1, str: 0, barPosition: 0, name: "Loading...", isActive: false },
			{ id: 3, index: 2, str: 0, barPosition: 0, name: "Loading...", isActive: false },
			{ id: 4, index: 3, str: 0, barPosition: 0, name: "Loading...", isActive: false },
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
					barPosition: barPositionFromStr(detectedMonitor?.str ?? monitor.str),
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
		setStrAndBarPos(state, { newStr, newBarPosition, index }) {
			state.list[index].str = newStr
			state.list[index].barPosition = newBarPosition
		},
		lastMouseXPosition(state, lastMouseXPosition) {
			state.lastMouseXPosition = lastMouseXPosition
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
			const x = round(state.lastMouseXPosition / factor, 2)
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
