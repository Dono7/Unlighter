import Monitor from "./Monitor"
import { openFileInWindow } from "./utils"

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

	loadFilterPage() {
		this.monitors.forEach((monitor) => {
			openFileInWindow(monitor.win, "filter")
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

	showOrHideMonitorIndex(action) {
		if (action !== "show" || (action === "show" && this.app.getPref("showScreenNumber"))) {
			this.monitors.forEach((monitor) => {
				monitor.win.webContents.send(`${action}-index`)
			})
		}
	}
}
