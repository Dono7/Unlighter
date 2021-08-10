const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("unlighter", {
	execAppMethod(data) {
		ipcRenderer.send("exec-app-method", data)
	},
	execModuleMethod(data) {
		ipcRenderer.send("exec-module-method", data)
	},
	on(channel, callback) {
		ipcRenderer.on(channel, callback)
	},
	once(channel, callback) {
		ipcRenderer.once(channel, callback)
	},
	removeListener(channel) {
		ipcRenderer.removeAllListeners(channel)
	},
	openUrl(url) {
		ipcRenderer.send("exec-app-method", { method: "openUrl", args: [url] })
	},
})

ipcRenderer.on("log", (event, data) => {
	console.log(data)
})

console.log("Ipc PCC running...")
