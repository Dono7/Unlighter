import { Menu, Tray } from "electron"
import path from "path"
import { isServeMode } from "./utils"

export default class UnlighterTray {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.electronApp

		this.toolTip = "Unlighter"
		this.tray = null
	}

	init() {
		const shouldShow = this.app.getPref("showInTaskbar")
		this.showAppInTaskbar(shouldShow)
	}

	showAppInTaskbar(shouldShow) {
		if (!this.app.pcc) return

		this.app.pcc.setSkipTaskbar(!shouldShow)
		this.reload()
	}

	toggleAppInTaskbar(shouldShow) {
		this.showAppInTaskbar(shouldShow)
		this.app.sendToPccFromCode("preferences-get")
	}

	reload() {
		this.destroy()
		this.create()
	}

	create() {
		if (this.tray || !this.app.pcc) return

		const iconPath = isServeMode()
			? path.join(__dirname, "/bundled/tray/icon.png")
			: path.join(__dirname, "/tray/icon.png")
		this.tray = new Tray(iconPath)
		this.tray.setToolTip(this.toolTip)
		this.tray.setContextMenu(this.menu())
		this.tray.on("click", () => {
			if (this.app.pcc) this.app.pcc.restore()
		})
	}

	destroy() {
		if (!this.tray || !this.app.pcc) return

		this.tray.destroy()
		this.tray = null
	}

	menu() {
		return Menu.buildFromTemplate([
			{
				label: "Monitors",
				click: () => {
					if (this.app.pcc) {
						this.app.pcc.restore()
						this.app.sendToPcc("go-to", "Monitors")
					}
				},
			},
			{
				label: "Preferences",
				click: () => {
					if (this.app.pcc) {
						this.app.pcc.restore()
						this.app.sendToPcc("go-to", "Preferences")
					}
				},
			},
			{
				label: "About",
				click: () => {
					if (this.app.pcc) {
						this.app.pcc.restore()
						this.app.sendToPcc("go-to", "About")
					}
				},
			},
			{
				label: "Help",
				click: () => {
					if (this.app.pcc) {
						this.app.pcc.restore()
						this.app.sendToPcc("go-to", "Help")
					}
				},
			},
			{
				type: "separator",
			},
			{
				label: this.app.getPref("showInTaskbar") ? "Hide Unlighter from taskbar" : "Show Unlighter in taskbar",
				click: () => {
					this.app.setPref("showInTaskbar", !this.app.getPref("showInTaskbar"))
				},
			},
			{
				label: "Reload default filters",
				click: () => {
					if (this.app.monitors) this.app.monitors.reloadFilters()
				},
			},
			{
				label: "Check for updates",
				click: () => {
					if (this.app.pcc && this.app.updater) {
						this.app.pcc.restore()
						this.app.updater.openWindow()
					}
				},
			},
			{
				type: "separator",
			},
			{
				label: "Exit Unlighter",
				role: "quit",
			},
		])
	}
}
