import { BrowserWindow, screen } from "electron"
import path from "path"

export default class Pcc {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.win = null
		this.runOnPccReady = []
		this.lastMinimize = 0
		this.lastRestore = 0

		this.createPccWindow()
	}

	createPccWindow() {
		const margin = 120
		const marginRight = this.app.config.isDevelopment ? this.app.Devtools.devtoolsFullWidth() : 0
		const mainScreen = screen.getPrimaryDisplay()
		const factor = mainScreen.scaleFactor
		const pccBounds = {
			width: 320,
			height: 400,
			x: mainScreen.workArea.width * factor - 320 - margin - marginRight,
			y: mainScreen.workArea.height * factor - 400 - margin,
		}

		this.win = new BrowserWindow({
			...pccBounds,
			title: "Unlighter",
			frame: false,
			maximizable: false,
			closable: true,
			backgroundColor: "#111",
			resizable: true,
			show: false,
			webPreferences: {
				devTools: true,
				nodeIntegration: true,
				preload: path.join(__dirname, "ipcPcc.js"),
			},
		})

		this.win.on("ready-to-show", () => {
			this.blockPccResize()
			this.win.show()
			this.setOnTop()
			this.initPccEvents()
			this.runOnPccReady.map((func) => func())
		})
	}

	initPccMonitorsTab(sendStrAfterInit = true) {
		const serializedMonitors = this.app.Monitors.serializeForPcc()
		if (serializedMonitors.length) this.send("init-pcc", { monitors: serializedMonitors, sendStrAfterInit })
	}

	onPccReadyToShow(callback) {
		this.runOnPccReady.push(callback)
	}

	blockPccResize() {
		if (!this.win) return
		const b = this.win.getBounds()
		b.width = 320
		b.height = 400
		this.win.setBounds(b)
		this.win.setResizable(false)
	}

	setOnTop(onTop = true) {
		onTop ? this.win.setAlwaysOnTop(true, "screen") : this.win.setAlwaysOnTop(false, "normal")
	}

	send(channel, data) {
		if (this.win) {
			this.win.webContents.send(channel, data)
		}
	}

	sendToPccFromCode(code) {
		if (code == "ask-for-init-pcc") {
			this.initPccMonitorsTab()
		}

		if (code == "preferences-get") this.send("preferences-get", this.app.Prefs.getPref())
	}

	log(msg) {
		if (this.pcc !== null) {
			this.send("log", msg)
		}
	}

	sendVersion() {
		const version = this.app.electron.getVersion()
		this.send("app-version", version)
	}

	restore() {
		this.win.restore()
	}

	minimize() {
		this.win.minimize()
	}

	setSkipTaskbar(shouldShow) {
		this.win.setSkipTaskbar(shouldShow)
	}

	initPccEvents() {
		this.win.on("close", () => this.onClose())
		this.win.on("blur", () => this.onBlur())
		this.win.on("focus", () => this.onFocus())
		this.win.on("minimize", () => this.onMinimize())
		this.win.on("restore", () => this.onRestore())
		this.win.on("move", () => this.onMove())
	}

	onClose() {
		this.app.Tray.destroy()
		this.app.electron.exit()
	}

	onBlur() {
		if (this.app.Prefs.getPref("minimizeOnBlur") && this.app.initialised) {
			const now = new Date()
			const limit = 250
			if (Math.abs(now - this.lastRestore) > limit && Math.abs(now - this.lastMinimize) > limit) {
				this.win.minimize()
			}
		}
	}

	onFocus() {
		this.setOnTop()
	}

	onMinimize(callback) {
		this.app.Monitors.showOrHideMonitorIndex("hide")
		this.lastMinimize = new Date()
	}

	onRestore(callback) {
		this.app.Monitors.showOrHideMonitorIndex("show")
		const now = new Date()
		if (Math.abs(now - this.lastMinimize) <= 180) {
			this.win.minimize()
		} else {
			this.lastRestore = new Date()
		}
	}

	onMove() {
		this.app.Updater.resizeUpdaterWindow()
	}
}
