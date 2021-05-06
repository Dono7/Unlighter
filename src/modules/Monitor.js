import { BrowserWindow } from "electron"
import path from "path"

export default class Monitor {
	constructor(unlighterApp, display, index) {
		this.app = unlighterApp
		this.str = 10
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
			webPreferences: {
				devTools: true,
				preload: path.join(__dirname, "ipcFilter.js"),
			},
		}
	}

	initWindow() {
		this.win = new BrowserWindow(this.options)
		this.win.loadFile("./../public/filter.html")
		this.win.webContents.send("update-index", this.index)
		if (this.app.config.showFilterDevTools) {
			this.win.webContents.openDevTools()
		} else {
			this.win.setIgnoreMouseEvents(true)
			this.win.setAlwaysOnTop(true, "screen")
		}
	}

	updateStr(payload) {
		const { str, time } = payload
		if (time <= this.lastStrUpdate) return

		this.str = str
		this.win.webContents.send("update-str", str)
	}

	serialize() {
		return {
			str: this.str,
			name: this.name,
			id: this.display.id,
		}
	}
}
