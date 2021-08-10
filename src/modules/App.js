import { BrowserWindow, ipcMain, screen, shell } from "electron"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib"
import MonitorsController from "./MonitorsController"
import Updater from "./Updater"
import path from "path"
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer"
import storage from "electron-json-storage"
import { openFileInWindow } from "./utils"
import logger from "electron-log"

export default class UnlighterApp {
	constructor(electronApp, config) {
		this.app = electronApp
		this.monitors = null
		this.pcc = null
		this.updater = null
		this.config = config
		this.launched = false
		this.lastMinimize = 0
		this.initialised = false
	}

	launch() {
		if (this.launched) {
			return
		} else {
			this.launched = true
		}
		this.loadUserPref()
		this.createPcc()
		this.createMonitors()
		this.createLocalServer()
		this.createUpdater()
		this.initDefaultPreferences()
		// this.installVueExtension()
		this.initPccEvents()
		this.initPccMonitorsTab()
		this.initIPC()
		this.initEvents()
		this.initialised = true
	}

	loadUserPref() {
		this.config = {
			...this.config,
			preferences: {
				...this.getPref(),
			},
		}
	}

	createPcc() {
		this.pcc = new BrowserWindow({
			title: "Unlighter",
			width: this.config.isDevelopment ? 820 : 320,
			height: 400,
			frame: false,
			maximizable: false,
			closable: true,
			backgroundColor: "#111",
			webPreferences: {
				devTools: true,
				nodeIntegration: true,
				preload: path.join(__dirname, "ipcPcc.js"),
			},
		})
	}

	createMonitors() {
		this.monitors = new MonitorsController(this, screen.getAllDisplays())
		this.monitors.initWindows()
	}

	async createLocalServer() {
		if (this.pcc === null) {
			throw new Error("The local server cannot run before PCC is created.")
		}

		if (!process.env.WEBPACK_DEV_SERVER_URL) {
			createProtocol("app")
		}

		openFileInWindow(this.pcc)

		if (this.config.isDevelopment) this.pcc.webContents.openDevTools({ mode: "right" })

		if (this.monitors) this.monitors.loadFilterPage()
	}

	createUpdater() {
		this.updater = new Updater(this)
	}

	initDefaultPreferences() {
		const userPref = this.getPref()
		if (userPref !== undefined) {
			for (const [key, value] of Object.entries(this.config.defaultConfig)) {
				if (userPref[key] === undefined) {
					userPref[key] = value
					storage.set("preferences", userPref)
				}
			}
		} else {
			storage.set("preferences", this.config.defaultConfig)
		}
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

	initPccEvents() {
		this.pcc.setAlwaysOnTop(true, "screen")
		this.pcc.on("close", () => {
			this.monitors.monitors.forEach((monitor) => {
				monitor.win.close()
			})
			this.app.quit()
		})
	}

	initPccMonitorsTab() {
		this.sendToPcc("init-pcc", this.monitors.serializeForPcc())
	}

	initIPC() {
		ipcMain.on("exec-module-method", (event, data) => {
			const { module, method, args = [] } = data
			if (this[module][method]) {
				this[module][method](...args)
			} else {
				logger.log(`exec-module-method: Method ${method} not found in the module ${module}. Args: ${args}`)
			}
		})
		ipcMain.on("exec-app-method", (event, data) => {
			const { method, args } = data
			if (this[method]) {
				this[method](...args)
			} else {
				logger.log(`exec-app-method: Method ${method} not found in the app. Args: ${args}`)
			}
		})
	}

	initEvents() {
		this.app.on("browser-window-focus", (event, sender) => {
			if (sender.id == this.pcc.id) {
				// pcc.setAlwaysOnTop(true, "screen")
			}
		})

		this.app.on("window-all-closed", () => {
			if (process.platform !== "darwin") {
				this.app.quit()
			}
		})

		this.app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) createWindow()
		})

		this.pcc.on("blur", () => {
			if (!this.getPref("pccOnTop")) {
				this.pcc.setAlwaysOnTop(false, "normal")
			}
			if (this.getPref("minimizeOnBlur") && this.initialised) {
				this.pcc.minimize()
			}
		})

		this.pcc.on("focus", () => {
			this.pcc.setAlwaysOnTop(true, "screen")
		})

		this.pcc.on("minimize", () => {
			this.monitors.showOrHideMonitorIndex("hide")
			this.lastMinimize = new Date()
		})

		this.pcc.on("restore", () => {
			this.monitors.showOrHideMonitorIndex("show")
			const now = new Date()
			if (Math.abs(now - this.lastMinimize) <= 180) {
				this.pcc.minimize()
			}
		})

		if (this.config.isDevelopment) {
			if (process.platform === "win32") {
				process.on("message", (data) => {
					if (data === "graceful-exit") {
						this.app.quit()
					}
				})
			} else {
				process.on("SIGTERM", () => {
					this.app.quit()
				})
			}
		}
	}

	sendToPccFromCode(code) {
		if (code == "ask-for-init-pcc") this.sendToPcc("init-pcc", this.monitors.serializeForPcc())

		if (code == "preferences-get") this.sendToPcc("preferences-get", this.getPref())
	}

	sendToPcc(channel, data) {
		if (this.pcc) {
			this.pcc.webContents.send(channel, data)
		}
	}

	getData(key) {
		return storage.getSync(key)
	}

	getPref(key = "") {
		return key == "" ? this.getData("preferences") : this.getData("preferences")[key]
	}

	setPref(key, value) {
		let newPref = this.getPref()
		if (key !== undefined && value !== undefined) {
			newPref[key] = value
		}
		storage.set("preferences", newPref, (error) => {
			switch (key) {
				case "showScreenNumber":
					this.monitors.showOrHideMonitorIndex(value ? "show" : "hide")
					break

				default:
					break
			}
		})
	}

	openUrl(url) {
		shell.openExternal(url)
	}

	pccLog(msg) {
		if (this.pcc !== null) {
			this.pcc.webContents.send("log", msg)
		}
	}
}
