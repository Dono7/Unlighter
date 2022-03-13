import { BrowserWindow } from "electron"
import { openFileInWindow, isServeMode } from "./utils"
import { autoUpdater } from "electron-updater"
import path from "path"
import logger from "electron-log"
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs"

export default class Updater {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.win = null

		this.haveUpdaterAlreadyBeenOpened = false
		this.lastCheck = null
		this.secondsBeforeCheckAfterStartup = 3

		this.pos = {
			width: 320,
			height:
				80 +
				(this.app.config.isDevelopment || this.app.Debugger.get("enablePccDevtools")
					? 130
					: 0),
			margin: 5,
		}

		this.configureAutoUpdater()
		this.autoCheckOnAppStartup()
		this.updateLastCheckString()
	}

	configureAutoUpdater() {
		autoUpdater.autoDownload = false
		autoUpdater.autoInstallOnAppQuit = false
		autoUpdater.allowPrerelease = true
		autoUpdater.allowDowngrade = false
		autoUpdater.logger = logger

		autoUpdater.on("checking-for-update", (e) => this.updateStatus("fetching", e))
		autoUpdater.on("update-available", (e) => this.updateStatus("available", e))
		autoUpdater.on("update-not-available", (e) => this.updateStatus("uptodate", e))
		autoUpdater.on("download-progress", (e) => this.updateStatus("downloading", e))
		autoUpdater.on("update-downloaded", (e) => this.updateStatus("downloaded", e))
		autoUpdater.on("error", (e) => this.updateStatus("error"))
	}

	autoCheckOnAppStartup() {
		this.app.Pcc.onPccReadyToShow(() => {
			setTimeout(() => {
				this.checkForUpdates()
				this.updateLastCheckString()
			}, 1000 * this.secondsBeforeCheckAfterStartup)
		})
	}

	updateLastCheckString() {
		dayjs.extend(relativeTime)
		const oneMinute = 60000
		setInterval(() => {
			this.sendLastCheckToPcc()
		}, oneMinute)
	}

	sendLastCheckToPcc() {
		if (this.lastCheck) {
			const str = dayjs().to(this.lastCheck)
			this.app.Pcc.send("update-lastcheck", str)
		}
	}

	openWindow() {
		if (this.app.Pcc.win === null) return

		if (this.win !== null) {
			this.closeWindow()
			return
		}

		this.win = new BrowserWindow({
			...this.getRefreshedBounds(),
			resizable:
				this.app.config.isDevelopment || this.app.Debugger.get("enablePccDevtools"),
			movable: false,
			maximizable: false,
			skipTaskbar: true,
			title: "Unlighter Updater",
			frame: false,
			parent: this.app.Pcc.win,
			focusable: false,
			show: !this.app.Pcc.win.isMinimized(),
			webPreferences: {
				devTools:
					this.app.config.isDevelopment || this.app.Debugger.get("enablePccDevtools"),
				nodeIntegration: true,
				preload: path.join(__dirname, "ipcPcc.js"),
			},
		})

		openFileInWindow(this.win, "updater")
		this.haveUpdaterAlreadyBeenOpened = true

		if (this.app.config.isDevelopment || this.app.Debugger.get("enablePccDevtools"))
			this.app.Devtools.openDetachedDevTools(this.win)

		this.win.once("ready-to-show", () => {
			this.allowAutoUpdateAndCheckForUpdate()
		})

		this.win.on("minimize", () => this.win.hide())
		this.win.on("restore", () => this.win.show())
	}

	allowAutoUpdateAndCheckForUpdate() {
		autoUpdater.autoDownload = true
		this.checkForUpdates(true)
	}

	checkForUpdates(forceCheckEvenInServeMode = false) {
		if (forceCheckEvenInServeMode || !isServeMode()) {
			if (forceCheckEvenInServeMode && !isServeMode()) {
				logger.warn(
					"Trying to fetch an update on serve mode. This will trigger an error from electron-updater.",
				)
			}
			this.lastCheck = dayjs()
			this.sendLastCheckToPcc()
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

	resizeUpdaterWindow() {
		if (this.win !== null && this.win.isVisible()) {
			this.win.setBounds(this.getRefreshedBounds())
		}
	}

	getRefreshedBounds() {
		const pccBounds = this.app.Pcc.win.getBounds()

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

	updateStatus(status, event) {
		this.app.Pcc.send("update-checked", dayjs())

		let percent
		if (status == "downloading" && event) {
			percent = event.transferred == 0 ? 0 : event.percent
		}

		if (
			(status == "available" || status == "downloaded" || status == "downloading") &&
			this.app.Pcc
		) {
			this.app.Pcc.send("update-available", event.version)
			if (!this.haveUpdaterAlreadyBeenOpened) {
				this.openWindow()
			}
		}

		if (this.win === null) return

		this.win.webContents.send("update-status", { status, percent })
	}

	quitAndInstall() {
		autoUpdater.quitAndInstall()
	}
}
