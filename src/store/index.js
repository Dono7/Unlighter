import { createLogger, createStore } from "vuex"

import app from "./app.module"
import menu from "./menu.module"
import monitors from "./monitors.module"
import preferences from "./preferences.module"

const loggerOptions = {
	filter(mutation) {
		const excludeTypes = ["monitors/lastMouseXPosition", "monitors/setStr"]
		return !excludeTypes.includes(mutation.type)
	},
}

export default createStore({
	plugins: [createLogger(loggerOptions)],
	state: {},
	mutations: {},
	actions: {},
	modules: {
		app,
		menu,
		monitors,
		preferences,
	},
})
