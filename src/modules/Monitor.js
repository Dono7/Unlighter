import { BrowserWindow } from "electron"
import path from "path"

export default class Monitor {
	constructor(unlighterApp, display, index) {
		this.app = unlighterApp
		this.str = this.app.getPref("screenStrength")
		this.lastStrUpdate = new Date()
		this.name = ""
		this.index = index
		this.display = display
		this.win = null

		this.options = {
			...display.bounds,
			title: "Unlighter Filter Window",
			transparent: true,
			frame: false,
			fullscreen: !this.app.config.showFilterDevTools,
			alwaysOnTop: !this.app.config.showFilterDevTools,
			skipTaskbar: true,
			focusable: false,
			webPreferences: {
				devTools: true,
				preload: path.join(__dirname, "ipcFilter.js"),
			},
		}
	}

	initWindow() {
		if (this.win !== null) return

		this.win = new BrowserWindow(this.options)
		if (this.app.config.showFilterDevTools) {
			this.win.webContents.openDevTools()
		} else {
			this.win.setIgnoreMouseEvents(true)
			this.win.setAlwaysOnTop(true, "screen")
		}
		this.win.once("ready-to-show", () => {
			this.app.monitors.updateShowOrHideIndex()
		})
	}

	updateStr(payload) {
		const { str, time } = payload
		if (time <= this.lastStrUpdate) return

		this.str = str
		this.win.webContents.send("update-str", str)
	}

	loadIndex() {
		this.win.webContents.send("update-index", this.index)
	}

	serialize() {
		return {
			str: this.str,
			name: this.name,
			id: this.display.id,
		}
	}

	close() {
		this.win.close()
		this.win = null
	}
}
