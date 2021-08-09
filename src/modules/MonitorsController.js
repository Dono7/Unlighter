import Monitor from "./Monitor"
import { openFileInWindow } from "./utils"
import { screen } from "electron"

export default class MonitorsController {
	constructor(unlighterApp, displays) {
		this.app = unlighterApp
		this.monitors = displays.map((display, index) => new Monitor(this.app, display, index))
		this.lastErrorTime = 0
	}

	initWindows() {
		this.monitors.forEach((monitor) => {
			monitor.initWindow()
		})

		screen.on("display-added", () => {
			this.reloadFilters()
		})
		screen.on("display-metrics-changed", () => {
			this.reloadFilters()
		})
		screen.on("display-removed", () => {
			this.reloadFilters()
		})
	}

	loadFilterPage() {
		this.monitors.forEach((monitor) => {
			openFileInWindow(monitor.win, "filter.html")
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

	updateShowOrHideIndex() {
		const action = this.app.getPref("showScreenNumber") ? "show" : "hide"
		this.showOrHideMonitorIndex(action)
	}

	killMonitors() {
		this.monitors.forEach((monitor) => {
			monitor.close()
		})
		this.monitors = []
	}

	reloadFilters() {
		screen.removeAllListeners()

		this.killMonitors()

		setTimeout(() => {
			const displays = screen.getAllDisplays()
			this.monitors = displays.map((display, index) => new Monitor(this.app, display, index))
			this.initWindows()
			this.loadFilterPage()
			this.app.initPccMonitorsTab()
		}, 2000)
	}
}
