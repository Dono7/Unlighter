import Monitor from "./Monitor"
import { openFileInWindow } from "./utils"
import { screen } from "electron"
import logger from "electron-log"

export default class MonitorsController {
	constructor(unlighterApp, displays) {
		this.app = unlighterApp
		this.monitors = displays.map(
			(display, index) => new Monitor(this.app, display, index),
		)
		this.lastErrorTime = 0
		this.mountedFilterPages = 0

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
				this.onFilterLoaded(monitor)
				if (filterLoaded++ == this.monitors.length - 1) {
					this.onAllFiltersLoaded()
				}
			})
		})
	}

	onFilterLoaded(monitor) {
		monitor.loadIndex()
	}

	onFilterMounted() {
		this.mountedFilterPages++
		if (this.mountedFilterPages >= this.monitors.length) {
			this.mountedFilterPages = this.mountedFilterPages - this.monitors.length
			this.onAllFiltersMounted()
		}
	}

	onAllFiltersLoaded() {}

	onAllFiltersMounted() {
		this.app.Pcc.initPccMonitorsTab(true)
	}

	serializeForPcc() {
		return this.monitors.map((monitor) => monitor.serialize())
	}

	synchronizeStoreMutationWithFilter(mutation) {
		this.monitors.forEach((monitor) => {
			monitor.synchronizeStoreMutation(mutation)
		})
	}

	shortcutTriggered(action, interval) {
		// Should check if enableShortcuts is enable
		// Then send a message to Store Handler for increase or decrease str
	}

	showOrHideMonitorIndex(action) {
		if (
			action !== "show" ||
			(action === "show" && this.app.Prefs.getPref("showScreenNumber"))
		) {
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
			this.monitors = displays.map(
				(display, index) => new Monitor(this.app, display, index),
			)
			this.initWindows()
			this.loadFilterPage()
			this.app.Pcc.movePccToCorner()
		}, 2000)
	}
}
