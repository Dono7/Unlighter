import { ipcMain } from "electron"
import logger from "electron-log"
import { openUrlInExternalBrowser } from "./utils"

export default class IPC {
	constructor(unlighterApp) {
		this.app = unlighterApp

		ipcMain.on("exec-module-method", (event, data) => {
			const { module, method, args = [] } = data
			if (this.app[module][method]) {
				this.app[module][method](...args)
			} else {
				logger.log(
					`exec-module-method: Method ${method} not found in the module ${module}. Args: ${args}`,
				)
			}
		})

		ipcMain.on("open-url", (event, url) => {
			openUrlInExternalBrowser(url)
		})
	}
}
