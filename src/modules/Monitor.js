import { BrowserWindow } from "electron"
import path from "path"

export default class Monitor {
	constructor(unlighterApp, display) {
		this.app = unlighterApp
		this.str = 10
		this.lastStrUpdate = new Date()
		this.name = ""
		this.display = display
		this.win = null

		this.options = {
			...display.bounds,
			title: "Unlighter Filter Window",
			transparent: true,
			frame: false,
			fullscreen: !this.app.config.showFilterDevTools,
			alwaysOnTop: true,
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
		}
	}
}
