import { BrowserWindow, screen } from "electron"

export default class Updater {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.width = 500
		this.margin = 20
	}

	devtoolsFullWidth() {
		return this.width + this.margin
	}

	openDetachedDevTools(win) {
		if (!win) return

		const devtools = new BrowserWindow({
			frame: false,
			parent: win,
			height: win.getBounds().height,
			width: this.width,
		})
		win.webContents.setDevToolsWebContents(devtools.webContents)
		win.webContents.openDevTools({ mode: "detach" })

		const resizeDevTools = () => {
			const winBounds = win.getBounds()
			const scr = screen.getDisplayMatching(winBounds)
			const factor = scr.scaleFactor
			const scrBounds = {
				w: scr.workArea.width * factor,
				h: scr.workArea.height * factor,
			}

			const devBounds = { width: this.width, height: winBounds.height }
			devBounds.x =
				scrBounds.w - (winBounds.x + winBounds.width) > this.width + this.margin
					? winBounds.x + winBounds.width + this.margin
					: winBounds.x - this.margin - this.width
			devBounds.y = winBounds.y

			devtools.setBounds(devBounds)
		}

		resizeDevTools()

		win.webContents.once("did-finish-load", resizeDevTools)
		win.on("move", resizeDevTools)
		win.on("close", () => {
			devtools.close()
		})
	}
}
