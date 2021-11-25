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
		const shouldShow = this.app.Prefs.getPref("showInTaskbar")
		this.showAppInTaskbar(shouldShow)
	}

	showAppInTaskbar(shouldShow) {
		if (!this.app.initialised) return

		this.app.Pcc.setSkipTaskbar(!shouldShow)
		this.reload()
	}

	toggleAppInTaskbar(shouldShow) {
		this.showAppInTaskbar(shouldShow)
	}

	reload() {
		this.destroy()
		this.create()
	}

	create() {
		if (this.tray || !this.app.initialised) return

		const iconPath = isServeMode()
			? path.join(__dirname, "/bundled/tray/icon.png")
			: path.join(__dirname, "/tray/icon.png")
		this.tray = new Tray(iconPath)
		this.tray.setToolTip(this.toolTip)
		this.tray.setContextMenu(this.menu())
		this.tray.on("click", () => {
			if (this.app.initialised) this.app.Pcc.restore()
		})
	}

	destroy() {
		if (!this.tray || !this.app.initialised) return

		this.tray.destroy()
		this.tray = null
	}

	menu() {
		return Menu.buildFromTemplate([
			{
				label: "Monitors",
				click: () => {
					if (this.app.initialised) {
						this.app.Pcc.restore()
						this.app.Pcc.send("go-to", "Monitors")
					}
				},
			},
			{
				label: "Preferences",
				click: () => {
					if (this.app.initialised) {
						this.app.Pcc.restore()
						this.app.Pcc.send("go-to", "Preferences")
					}
				},
			},
			{
				label: "About",
				click: () => {
					if (this.app.initialised) {
						this.app.Pcc.restore()
						this.app.Pcc.send("go-to", "About")
					}
				},
			},
			{
				label: "Help",
				click: () => {
					if (this.app.initialised) {
						this.app.Pcc.restore()
						this.app.Pcc.send("go-to", "Help")
					}
				},
			},
			{
				type: "separator",
			},
			{
				label: this.app.Prefs.getPref("showInTaskbar")
					? "Hide Unlighter from taskbar"
					: "Show Unlighter in taskbar",
				click: () => {
					this.app.Prefs.setPref(
						"showInTaskbar",
						!this.app.Prefs.getPref("showInTaskbar"),
					)
				},
			},
			{
				label: "Reload default filters",
				click: () => {
					if (this.app.Monitors) this.app.Monitors.reloadFilters()
				},
			},
			{
				label: "Check for updates",
				click: () => {
					if (this.app.initialised && this.app.Updater) {
						this.app.Pcc.restore()
						this.app.Updater.openWindow()
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
