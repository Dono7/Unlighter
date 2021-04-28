"use strict"

import { app, protocol, BrowserWindow } from "electron"
import { createProtocol } from "vue-cli-plugin-electron-builder/lib"
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer"
import { isDevelopment } from "./config.json"
const path = require("path")

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }])

async function createPpc() {
	const win = new BrowserWindow({
		title: "Unlighter",
		width: 820,
		height: 400,
		frame: false,
		maximizable: false,
		backgroundColor: "#111",
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			preload: path.join(__dirname, "ipcPcc.js"),
		},
	})

	// Load Vue extension
	if (process.env.WEBPACK_DEV_SERVER_URL) {
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
		if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		createProtocol("app")
		win.loadURL("app://./index.html")
	}
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on("ready", async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		try {
			await installExtension(VUEJS_DEVTOOLS)
		} catch (e) {
			console.error("Vue Devtools failed to install:", e.toString())
		}
	}

	createPpc()
})

if (isDevelopment) {
	if (process.platform === "win32") {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				app.quit()
			}
		})
	} else {
		process.on("SIGTERM", () => {
			app.quit()
		})
	}
}
