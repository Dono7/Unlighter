const { BrowserWindow } = require("electron")
const path = require("path")

class Monitor {
	constructor(display) {
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
			fullscreen: true,
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
		this.win.setIgnoreMouseEvents(true)
		this.win.setAlwaysOnTop(true, "screen")
		// this.win.webContents.openDevTools()
	}

	updateStr(payload) {
		const { str, time } = payload
		if (time > this.lastStrUpdate) {
			this.str = str
			this.win.webContents.send("update-str", str)
		}
	}

	serialize() {
		return {
			str: this.str,
			name: this.name,
		}
	}
}

module.exports = Monitor
