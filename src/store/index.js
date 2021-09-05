import { createLogger, createStore } from "vuex"

import app from "./app.module"

export default createStore({
	plugins: [createLogger()],
	state: {},
	mutations: {},
	actions: {},
	modules: {
		app,
	},
})
