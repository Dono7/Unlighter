"use strict"

import { app, protocol } from "electron"
import config from "./config.json"
import UnlighterApp from "./modules/App"

protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } },
])

app.on("ready", async () => {
	const App = new UnlighterApp(app, config)
})
