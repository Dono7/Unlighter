"use strict"

import { app, protocol } from "electron"
import config from "./config.json"
import UnlighterApp from "./modules/App"
import logger from "electron-log"

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
	logger.log("App already running, quitting second instance...")
	app.quit()
}

protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } },
])

app.on("ready", async () => {
	const App = new UnlighterApp(app, config)
})
