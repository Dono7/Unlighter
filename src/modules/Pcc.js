import { perfDisplay } from "./Perf"
import { BrowserWindow, screen } from "electron"
import path from "path"

export default class Pcc {
	constructor(unlighterApp) {
		perfDisplay("Pcc constructor called")
		this.app = unlighterApp
		this.win = null
		this.runOnPccReady = []
		this.lastMinimize = 0
		this.lastRestore = 0
		this.moveToCornerOnNextRestore = false

		this.pccHeight = 416

		this.createPccWindow()
	}

	createPccWindow() {
		perfDisplay("Pcc createPccWindow called")
		this.win = new BrowserWindow({
			...this.calculateCornerPccPosition(),
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

		this.win.on("show", () => {
			perfDisplay("Pcc now visible")
		})

		this.win.on("ready-to-show", () => {
			perfDisplay("Pcc 'ready-to-show' triggered")
			this.blockPccResize()
			this.win.show()
			this.setOnTop()
			this.initPccEvents()
			this.registerLocalShortcuts()
			this.runOnPccReady.map((func) => func())
		})
	}

	calculateCornerPccPosition() {
		const margin = 120
		const marginRight =
			this.app.config.isDevelopment || this.app.Debugger.get("enablePccDevtools")
				? this.app.Devtools.devtoolsFullWidth()
				: 0
		const mainScreen = screen.getPrimaryDisplay()
		return {
			x: Math.round(mainScreen.workArea.width - 320 - margin - marginRight),
			y: Math.round(mainScreen.workArea.height - this.pccHeight - margin),
			width: 320,
			height: this.pccHeight,
		}
	}

	movePccToCorner() {
		if (this.win) {
			if (this.win.isMinimized()) {
				this.moveToCornerOnNextRestore = true
			} else {
				const bounds = this.calculateCornerPccPosition()
				this.win.setBounds(bounds)
			}
		}
	}

	registerLocalShortcuts() {
		this.win.webContents.on("before-input-event", (event, input) => {
			if (input.shift && input.control && input.key.toLowerCase() === "d") {
				event.preventDefault()
				this.app.Debugger.openDebugFileInFolder()
			}

			if (input.shift && input.control && input.key.toLowerCase() === "r") {
				event.preventDefault()
				this.app.restart()
			}

			if (input.shift && input.control && input.key.toLowerCase() === "s") {
				event.preventDefault()
				this.app.Debugger.resetDebuggerSettings()
			}
		})
	}

	onStoreHandlerMounted() {}

	onPccMounted() {
		this.app.eitherPccOrFiltersMounted()
	}

	onPccReadyToShow(callback) {
		this.runOnPccReady.push(callback)
	}

	blockPccResize() {
		if (!this.win) return
		const b = this.win.getBounds()
		b.width = 320
		b.height = this.pccHeight
		this.win.setBounds(b)
		this.win.setResizable(false)
	}

	setOnTop(onTop = true) {
		if (!this.win) {
			return
		}
		onTop
			? this.win.setAlwaysOnTop(true, "screen")
			: this.win.setAlwaysOnTop(false, "normal")
	}

	addStrToAllFilters(valueToAdd) {
		this.send("add-value-to-all-filters", valueToAdd)
	}

	send(channel, data) {
		if (this.win) {
			this.win.webContents.send(channel, data)
		}
	}

	sendPrefs() {
		const prefs = this.app.Prefs.getPref()
		this.send("set-prefs", prefs)
	}

	log(msg) {
		if (this.pcc !== null) {
			this.send("log", msg)
		}
	}

	onStoreReady() {
		this.sendVersion()
	}

	sendMonitorsList() {
		const serializedMonitors = this.app.Monitors.serializeForPcc()
		if (serializedMonitors.length) this.send("set-monitors-list", serializedMonitors)
	}

	sendVersion() {
		const version = this.app.electron.getVersion()
		this.send("set-app-version", version)
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
			if (
				Math.abs(now - this.lastRestore) > limit &&
				Math.abs(now - this.lastMinimize) > limit
			) {
				this.win.minimize()
			}
		}
	}

	onFocus() {
		this.setOnTop()
	}

	onMinimize() {
		this.app.Monitors.showOrHideMonitorIndex("hide")
		this.lastMinimize = new Date()
		if (this.app.Updater.win) this.app.Updater.win.minimize()
	}

	onRestore() {
		if (this.moveToCornerOnNextRestore) {
			this.moveToCornerOnNextRestore = false
			this.movePccToCorner()
		}
		this.app.Monitors.showOrHideMonitorIndex("show")
		const now = new Date()
		if (Math.abs(now - this.lastMinimize) <= 180) {
			this.win.minimize()
		} else {
			this.lastRestore = new Date()
			if (this.app.Updater.win) {
				this.app.Updater.resizeUpdaterWindow()
				this.app.Updater.win.restore()
			}
		}
	}

	onMove() {
		this.app.Updater.resizeUpdaterWindow()
	}
}
