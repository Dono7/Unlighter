import { BrowserWindow } from "electron"
import { openFileInWindow } from "./utils"
import { autoUpdater } from "electron-updater"
import path from "path"
import logger from "electron-log"

export default class Updater {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.win = null

		this.pos = {
			width: 320 + (this.app.config.isDevelopment ? 500 : 0),
			height: 80 + (this.app.config.isDevelopment ? 130 : 0),
			margin: 5,
		}

		this.configureAutoUpdater()

		this.app.pcc.on("move", () => {
			if (this.win !== null) {
				this.win.setBounds(this.getRefreshedBounds())
			}
		})
	}

	configureAutoUpdater() {
		autoUpdater.autoDownload = true
		autoUpdater.autoInstallOnAppQuit = true
		autoUpdater.allowPrerelease = true
		autoUpdater.allowDowngrade = false
		autoUpdater.logger = logger

		autoUpdater.on("checking-for-update", (e) => this.updateStatus("fetching"))
		autoUpdater.on("update-available", (e) => this.updateStatus("available"))
		autoUpdater.on("update-not-available", (e) => this.updateStatus("uptodate"))
		autoUpdater.on("download-progress", (e) => this.updateStatus("downloading", e.percent))
		autoUpdater.on("update-downloaded", (e) => this.updateStatus("downloaded"))
		autoUpdater.on("error", (e) => this.updateStatus("error"))
	}

	openWindow() {
		if (this.app.pcc === null) return
		if (this.win !== null) {
			this.closeWindow()
			return
		}

		this.win = new BrowserWindow({
			...this.getRefreshedBounds(),
			resizable: this.app.config.isDevelopment,
			movable: false,
			maximizable: false,
			skipTaskbar: true,
			title: "Unlighter Updater",
			frame: false,
			parent: this.app.pcc,
			backgroundColor: "#1A1937",
			webPreferences: {
				devTools: true,
				preload: path.join(__dirname, "ipcFilter.js"),
			},
		})

		openFileInWindow(this.win, "updater", this.app.config.isDevelopment)

		this.win.once("ready-to-show", () => {
			autoUpdater.checkForUpdates()
		})
	}

	closeWindow() {
		if (this.win === null) return

		this.win.close()
		this.win = null
	}

	iconClicked(status) {
		if (status == "error" || status == "uptodate") {
			this.closeWindow()
		}
		if (status == "downloaded") {
			this.quitAndInstall()
		}
	}

	getRefreshedBounds() {
		const pccBounds = this.app.pcc.getBounds()

		return {
			width: this.pos.width,
			height: this.pos.height,
			x: pccBounds.x,
			y:
				pccBounds.y - this.pos.height - this.pos.margin > 0
					? pccBounds.y - this.pos.height - this.pos.margin
					: pccBounds.y + pccBounds.height + this.pos.margin,
		}
	}

	updateStatus(status, percent) {
		if (this.win === null) return
		this.win.webContents.send("update-status", { status, percent })
	}

	sendVersion(version) {
		this.app.pcc.webContents.send("app-version", version)
	}

	quitAndInstall() {
		autoUpdater.quitAndInstall()
	}
}
