import Monitor from "./Monitor"
import { openFileInWindow } from "./utils"
import { screen } from "electron"

export default class MonitorsController {
	constructor(unlighterApp, displays) {
		this.app = unlighterApp
		this.monitors = displays.map((display, index) => new Monitor(this.app, display, index))
		this.lastErrorTime = 0

		this.initWindows()
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
		let filterLoaded = 0
		this.monitors.forEach((monitor) => {
			openFileInWindow(monitor.win, "filter")
			monitor.win.webContents.once("did-finish-load", () => {
				this.onFilterLoad(monitor)
				if (filterLoaded++ == this.monitors.length - 1) {
					this.onAllFiltersLoad()
				}
			})
		})
	}

	onFilterLoad(monitor) {
		monitor.loadIndex()
	}

	onAllFiltersLoad() {
		this.app.Pcc.initPccMonitorsTab(true)
	}

	serializeForPcc() {
		return this.monitors.map((monitor) => monitor.serialize())
	}

	updateMonitorsStr(monitorsStr, { init = false, showStr = false }) {
		if (monitorsStr.length !== this.monitors.length) {
			if (new Date() - this.lastErrorTime > 10000) {
				this.lastErrorTime = new Date()
				throw new Error("Number of monitors in PCC and in the app are not the same.")
			}
		}
		this.monitors.forEach((monitor, index) => {
			monitor.updateStr(monitorsStr[index], { init, showStr })
		})
	}

	shortcutTriggered(action, interval) {
		if (!this.app.Prefs.getPref("enableShortcuts")) return

		const monitorsStr = this.monitors.map((m) => ({ str: m.str, time: new Date() }))
		const newStr = monitorsStr.map((m) => {
			if (action == "increase") m.str = Math.min(Math.round((m.str + interval) * 100) / 100, 100)

			if (action == "decrease") m.str = Math.max(Math.round((m.str - interval) * 100) / 100, 0)

			return m
		})

		this.updateMonitorsStr(newStr, { init: false, showStr: true })
		this.app.Pcc.initPccMonitorsTab(false)
	}

	showOrHideMonitorIndex(action) {
		if (action !== "show" || (action === "show" && this.app.Prefs.getPref("showScreenNumber"))) {
			this.monitors.forEach((monitor) => {
				monitor.win.webContents.send(`${action}-index`)
			})
		}
	}

	updateShowOrHideIndex() {
		const action = this.app.Prefs.getPref("showScreenNumber") ? "show" : "hide"
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
			this.app.Pcc.movePccToCorner()
		}, 2000)
	}
}
