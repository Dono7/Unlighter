import { BrowserWindow } from "electron"
import { openFileInWindow, isServeMode } from "./utils"
import { autoUpdater } from "electron-updater"
import path from "path"
import logger from "electron-log"

export default class Updater {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.win = null

		this.pos = {
			width: 320,
			height: 80 + (this.app.config.isDevelopment ? 130 : 0),
			margin: 5,
		}

		this.configureAutoUpdater()
		this.autoCheckOnAppStartup()

		this.app.pcc.on("move", () => {
			if (this.win !== null) {
				this.win.setBounds(this.getRefreshedBounds())
			}
		})
	}

	configureAutoUpdater() {
		autoUpdater.autoDownload = false
		autoUpdater.autoInstallOnAppQuit = false
		autoUpdater.allowPrerelease = true
		autoUpdater.allowDowngrade = false
		autoUpdater.logger = logger

		autoUpdater.on("checking-for-update", (e) => this.updateStatus("fetching"))
		autoUpdater.on("update-available", (e) => this.updateStatus("available"))
		autoUpdater.on("update-not-available", (e) => this.updateStatus("uptodate"))
		autoUpdater.on("download-progress", (e) => this.updateStatus("downloading", e.transferred == 0 ? 0 : e.percent))
		autoUpdater.on("update-downloaded", (e) => this.updateStatus("downloaded"))
		autoUpdater.on("error", (e) => this.updateStatus("error"))
	}

	autoCheckOnAppStartup() {
		this.app.pcc.on("ready-to-show", () => {
			setTimeout(() => {
				this.checkForUpdates()
			}, 5000)
		})
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
			focusable: false,
			webPreferences: {
				devTools: this.app.config.isDevelopment,
				nodeIntegration: true,
				preload: path.join(__dirname, "ipcPcc.js"),
			},
		})

		openFileInWindow(this.win, "updater")

		if (this.app.config.isDevelopment) this.app.devtools.openDetachedDevTools(this.win)

		this.win.once("ready-to-show", () => {
			this.allowAutoUpdateAndCheckForUpdate()
		})
	}

	allowAutoUpdateAndCheckForUpdate() {
		autoUpdater.autoDownload = true
		this.checkForUpdates(true)
	}

	checkForUpdates(forceCheckEvenInServeMode = false) {
		if (forceCheckEvenInServeMode || !isServeMode()) {
			if (forceCheckEvenInServeMode && !isServeMode()) {
				console.warn("Trying to fetch an update on serve mode. This will trigger an error from electron-updater.")
			}
			autoUpdater.checkForUpdates()
		}
	}

	closeWindow() {
		if (this.win === null) return

		this.win.destroy() // Bug: Should be this.win.close() but it does not work...
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
		if ((status == "available" || status == "downloaded" || status == "download-progress") && this.app.pcc) {
			this.app.sendToPcc("update-available")
		}

		if (this.win === null) return
		this.win.webContents.send("update-status", { status, percent })
	}

	quitAndInstall() {
		autoUpdater.quitAndInstall()
	}
}
