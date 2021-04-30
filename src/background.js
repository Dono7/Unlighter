"use strict"

// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer"
const { app, protocol, BrowserWindow, ipcMain, screen } = require("electron")
const { createProtocol } = require("vue-cli-plugin-electron-builder/lib")
const { isDevelopment } = require("./config.json")
const MonitorsController = require("./modules/MonitorsController")
const path = require("path")

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }])

let pcc
let monitors

async function createPpc() {
	pcc = new BrowserWindow({
		title: "Unlighter",
		width: isDevelopment ? 820 : 320,
		height: 440,
		frame: false,
		maximizable: false,
		closable: true,
		backgroundColor: "#111",
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			preload: path.join(__dirname, "ipcPcc.js"),
		},
	})

	monitors = new MonitorsController(screen.getAllDisplays())
	monitors.initWindows()

	// Load Vue extension
	if (process.env.WEBPACK_DEV_SERVER_URL) {
		await pcc.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
		if (!process.env.IS_TEST && isDevelopment) pcc.webContents.openDevTools()
	} else {
		createProtocol("app")
		pcc.loadURL("app://./index.html")
	}

	pcc.setAlwaysOnTop(true, "screen")
	sendToPcc("init-pcc", monitors.serializeForPcc())
}

ipcMain.on("pcc-to-monitors", (event, data) => {
	console.log(data)
})

ipcMain.on("pcc-to-main", (event, data) => {
	const { msg } = data
	switch (msg) {
		case "quit":
			app.exit()
			break

		case "minimize":
			pcc.minimize()
			break

		case "ask-for-init-pcc":
			sendToPcc("init-pcc", monitors.serializeForPcc())
			break

		case "monitors-str-changed":
			monitors.updateMonitorsStr(data.monitorsStr)
			break

		default:
			console.log("default")
			break
	}
})

const sendToPcc = (channel, data) => {
	if (pcc) {
		pcc.webContents.send(channel, data)
	}
}
app.on("browser-window-focus", (event, sender) => {
	if (sender.id == pcc.id) {
		pcc.setAlwaysOnTop(true, "screen")
	}
})

app.on("browser-window-blur", (event, sender) => {
	if (sender.id == pcc.id) {
		pcc.setAlwaysOnTop(false, "screen")
		// pcc.minimize()
	}
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on("ready", async () => {
	// Install Vue Extension
	// if (isDevelopment && !process.env.IS_TEST) {
	// 	try {
	// 		await installExtension(VUEJS_DEVTOOLS)
	// 	} catch (e) {
	// 		console.error("Vue Devtools failed to install:", e.toString())
	// 	}
	// }

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
