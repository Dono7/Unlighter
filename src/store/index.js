import { createLogger, createStore } from "vuex"

import app from "./app.module"
import menu from "./menu.module"

export default createStore({
	plugins: [createLogger()],
	state: {},
	mutations: {},
	actions: {},
	modules: {
		app,
		menu,
	},
})
