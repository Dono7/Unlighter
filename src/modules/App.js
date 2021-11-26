import { BrowserWindow, screen } from "electron"
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer"
import { openFileInWindow, isServeMode } from "./utils"
import logger from "electron-log"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib"

// Modules
import MonitorsController from "./MonitorsController"
import Updater from "./Updater"
import Devtools from "./Devtools"
import Tray from "./Tray"
import Preferences from "./Preferences"
import Shortcuts from "./Shortcuts"
import Pcc from "./Pcc"
import IPC from "./IPC"
import Debugger from "./Debugger"

export default class UnlighterApp {
	constructor(electronApp, config) {
		this.electron = electronApp
		this.config = config
		this.initialised = false

		// Creating App Modules
		this.Debugger = new Debugger(this)
		this.Prefs = new Preferences(this)
		this.Devtools = new Devtools(this)
		this.Shortcuts = new Shortcuts(this)
		this.Tray = new Tray(this)
		this.Pcc = new Pcc(this)
		this.Monitors = new MonitorsController(this, screen.getAllDisplays())
		this.Updater = new Updater(this)
		this.IPC = new IPC(this)

		this.createLocalServer()
		// this.installVueExtension()
		this.initEvents()
	}

	async createLocalServer() {
		if (!isServeMode()) {
			createProtocol("app")
		}

		openFileInWindow(this.Pcc.win)

		if (this.config.isDevelopment) this.Devtools.openDetachedDevTools(this.Pcc.win)

		if (this.Monitors) this.Monitors.loadFilterPage()
	}

	async installVueExtension() {
		// if (this.config.isDevelopment && !process.env.IS_TEST && this.config.loadVueExtension) {
		// 	console.log("installing Vue...")
		// 	try {
		// 		await installExtension(VUEJS_DEVTOOLS)
		// 	} catch (e) {
		// 		console.error("Vue Devtools failed to install:", e.toString())
		// 	}
		// }
	}

	eitherPccOrFiltersMounted() {
		if (this.isPccOrFiltersReady) {
			this.onPccAndAllFiltersMounted()
		} else {
			this.isPccOrFiltersReady = true
		}
	}

	onPccAndAllFiltersMounted() {
		this.Pcc.sendMonitorsList()
		this.Pcc.sendPrefs()
	}

	initEvents() {
		this.Pcc.onPccReadyToShow(() => {
			this.initialised = true
			this.Tray.init()

			if (this.Prefs.getPref("enableShortcuts")) {
				this.Shortcuts.bindShortcuts()
			}
		})

		this.electron.on("window-all-closed", () => {
			if (process.platform !== "darwin") {
				this.electron.quit()
			}
		})

		this.electron.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) createWindow()
		})

		this.electron.on("second-instance", () => {
			this.Pcc.restore()
		})

		if (this.config.isDevelopment) {
			if (process.platform === "win32") {
				process.on("message", (data) => {
					if (data === "graceful-exit") {
						this.electron.quit()
					}
				})
			} else {
				process.on("SIGTERM", () => {
					this.electron.quit()
				})
			}
		}
	}
}
