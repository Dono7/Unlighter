import { BrowserWindow, ipcMain, screen } from "electron"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib"
import MonitorsController from "./MonitorsController"
import path from "path"
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer"
import storage from "electron-json-storage"

export default class UnlighterApp {
	constructor(electronApp, config) {
		this.app = electronApp
		this.monitors = null
		this.pcc = null
		this.config = config
		this.launched = false
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
		this.initDefaultPreferences()
		// this.installVueExtension()
		this.initPcc()
		this.initIPC()
		this.initEvents()
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
			height: 440,
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
		if (process.env.WEBPACK_DEV_SERVER_URL) {
			await this.pcc.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
			if (!process.env.IS_TEST && this.config.isDevelopment) {
				this.pcc.webContents.openDevTools({ mode: "right" })
			}
		} else {
			createProtocol("app")
			this.pcc.loadURL("app://./index.html")
		}
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

	initPcc() {
		this.pcc.setAlwaysOnTop(true, "screen")
		this.sendToPcc("init-pcc", this.monitors.serializeForPcc())
	}

	initIPC() {
		ipcMain.on("pcc-to-main", (event, data) => {
			const { msg } = data
			switch (msg) {
				case "quit":
					this.app.exit()
					break

				case "minimize":
					this.pcc.minimize()
					break

				case "ask-for-init-pcc":
					this.sendToPcc("init-pcc", this.monitors.serializeForPcc())
					break

				case "monitors-str-changed":
					this.monitors.updateMonitorsStr(data.monitorsStr)
					break

				case "preferences-set":
					this.setPref(data.key, data.value)
					break

				case "preferences-get":
					this.sendToPcc("preferences-get", this.getPref())
					break

				default:
					console.log("default", msg)
					break
			}
		})

		ipcMain.on("pcc-to-monitors", (event, data) => {
			const { msg, action, index } = data
			switch (msg) {
				case "index":
					this.monitors.index(index, action)
					break

				default:
					break
			}
		})
	}

	initEvents() {
		this.app.on("browser-window-focus", (event, sender) => {
			if (sender.id == this.pcc.id) {
				// pcc.setAlwaysOnTop(true, "screen")
			}
		})

		this.app.on("browser-window-blur", (event, sender) => {
			if (sender.id == this.pcc.id) {
				// pcc.setAlwaysOnTop(false, "screen")
				// this.pcc.minimize()
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
		if (key && value) {
			newPref[key] = value
		}
		storage.set("preferences", newPref)
	}
}
