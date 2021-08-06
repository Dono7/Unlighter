import { BrowserWindow, ipcMain, screen, shell } from "electron"
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
		this.initDefaultPreferences()
		// this.installVueExtension()
		this.initPcc()
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
		if (process.env.WEBPACK_DEV_SERVER_URL) {
			if(this.monitors) this.monitors.loadFilterPage()
			await this.pcc.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
			if (!process.env.IS_TEST && this.config.isDevelopment) {
				this.pcc.webContents.openDevTools({ mode: "right" })
			}
		} else {
			createProtocol("app")
			this.pcc.loadURL("app://./index.html")
			if(this.monitors) this.monitors.loadFilterPage(true)
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
		this.pcc.on('close', () => {
			this.monitors.monitors.forEach((monitor) => {
				monitor.win.close()
			});
			this.app.quit()
		})
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

				case "open-url":
					this.openUrl(data.url)
					break

				default:
					console.log("default", msg)
					break
			}
		})

		ipcMain.on("pcc-to-monitors", (event, data) => {
			const { msg } = data
			switch (msg) {
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

		this.app.on("window-all-closed", () => {
			if (process.platform !== "darwin") {
				this.app.quit()
			}
		})

		this.app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) createWindow()
		})

		this.pcc.on("blur", () => {
			this.monitors.showOrHideMonitorIndex("hide")
			if (!this.getPref("pccOnTop")) {
				this.pcc.setAlwaysOnTop(false, "normal")
			}
			if (this.getPref("minimizeOnBlur") && this.initialised) {
				this.pcc.minimize()
			}
		})

		this.pcc.on("focus", () => {
			this.monitors.showOrHideMonitorIndex("show")
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
		if(this.pcc !== null) {
			this.pcc.webContents.send('log',msg)
		}
	}
}
