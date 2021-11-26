import storage from "electron-json-storage"
import logger from "electron-log"
import path from "path"
import { shell } from "electron"

export default class Debugger {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.filename = "debugger"
		this.settings = {}

		this.syncAndStoreDebugSettings()
	}

	get(key) {
		return this.settings[key].value
	}

	syncAndStoreDebugSettings() {
		const defaultSettings = this.getDefaultDebuggerSettings()
		const storedSettings = storage.getSync(this.filename)
		const settings = { ...defaultSettings, ...storedSettings }

		this.settings = settings

		this.set(settings)
	}

	resetDebuggerSettings() {
		const defaultSettings = this.getDefaultDebuggerSettings()
		this.set(defaultSettings)
	}

	openDebugFileInFolder() {
		shell.showItemInFolder(path.join(storage.getDataPath(), `${this.filename}.json`))
	}

	set(settings) {
		storage.set("debugger", settings, { prettyPrinting: true }, (error) => {
			if (error) {
				logger.error("Debugger : Failed to store settings.")
				logger.error(error)
			}
		})
	}

	getDefaultDebuggerSettings() {
		return {
			enablePccDevtools: {
				value: false,
				comment: "If true, open chrome devtools attached to the Pcc window",
			},
			enableFirstFilterDevtools: {
				value: false,
				comment: "If true, open chrome devtools on the first filter only",
				warning:
					"The filter of Monitor 1 will NOT be transparent. But you can still click through the filter.",
			},
			disableMutationLogger: {
				value: false,
				state: "Not implemented yet",
				comment: "If true, hide all logs about store mutation in the Pcc Chrome Devtools",
			},
			allForOne: {
				value: false,
				state: "Not implemented yet",
				comment:
					"If true, all sliders are unlocked, but only the first monitor can be changed.",
			},
		}
	}
}
