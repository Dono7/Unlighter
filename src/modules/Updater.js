import { BrowserWindow } from "electron"
import { openFileInWindow } from "./utils"

export default class Updater {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.win = null

		this.pos = {
			width: 320 + (this.app.config.isDevelopment ? 500 : 0),
			height: 60 + (this.app.config.isDevelopment ? 130 : 0),
			margin: 5,
		}
		console.log("Updater created")
	}

	openWindow() {
		if (this.win !== null || this.app.pcc === null) return

		this.win = new BrowserWindow({
			...this.getRefreshedBounds(),
			resizable: false,
			movable: false,
			maximizable: false,
			skipTaskbar: true,
			title: "Unlighter Updater",
			frame: false,
			parent: this.app.pcc,
			backgroundColor: "#1A1937",
		})

		openFileInWindow(this.win, "updater", this.app.config.isDevelopment)

		this.app.pcc.on("move", () => {
			this.win.setBounds(this.getRefreshedBounds())
		})
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
}
