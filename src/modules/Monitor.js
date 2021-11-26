import { BrowserWindow } from "electron"
import path from "path"

export default class Monitor {
	constructor(unlighterApp, display, index) {
		this.app = unlighterApp
		this.str = this.app.Prefs.getPref("screenStrength")
		this.lastStrUpdate = new Date()
		this.name = ""
		this.index = index
		this.display = display
		this.win = null
		this.dev =
			(this.app.config.showFilterDevTools ||
				this.app.Debugger.get("enableFirstFilterDevtools")) &&
			index == 0

		this.options = {
			...display.bounds,
			title: "Unlighter Filter Window",
			transparent: true,
			frame: false,
			fullscreen: !this.dev,
			alwaysOnTop: !this.dev,
			skipTaskbar: true,
			focusable: false,
			webPreferences: {
				devTools: true,
				preload: path.join(__dirname, "ipcPcc.js"),
			},
		}
	}

	initWindow() {
		if (this.win !== null) return

		this.win = new BrowserWindow(this.options)
		if (this.dev) {
			this.win.webContents.openDevTools()
		} else {
			this.win.setIgnoreMouseEvents(true)
			this.win.setAlwaysOnTop(true, "screen")
			this.app.Pcc.setOnTop()
		}
		this.win.once("ready-to-show", () => {
			this.app.Monitors.updateShowOrHideIndex()
		})
	}

	synchronizeStoreMutation(mutation) {
		this.win.webContents.send("sync-mutation", mutation)
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
