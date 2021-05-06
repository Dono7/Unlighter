import Monitor from "./Monitor"

export default class MonitorsController {
	constructor(unlighterApp, displays) {
		this.app = unlighterApp
		this.monitors = displays.map((display, index) => new Monitor(unlighterApp, display, index))
		this.lastErrorTime = 0
	}

	initWindows() {
		this.monitors.forEach((monitor) => {
			monitor.initWindow()
		})
	}

	serializeForPcc() {
		return this.monitors.map((monitor) => monitor.serialize())
	}

	updateMonitorsStr(monitorsStr) {
		if (monitorsStr.length !== this.monitors.length) {
			if (new Date() - this.lastErrorTime > 10000) {
				this.lastErrorTime = new Date()
				throw new Error("Number of monitors in PCC and in the app are not the same.")
			}
		}
		this.monitors.forEach((monitor, index) => {
			monitor.updateStr(monitorsStr[index])
		})
	}

	index(index, action) {
		if (index > this.monitors.length) {
			throw new Error("Try to show screen index but screen not found.")
		}
		if (action !== "show" || (action === "show" && this.app.getPref("showScreenNumber"))) {
			this.monitors[index].win.webContents.send(`${action}-index`)
		}
	}
}
