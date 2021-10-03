const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("unlighter", {
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
		ipcRenderer.send("open-url", url)
	},
})

ipcRenderer.on("log", (event, data) => {
	console.log(data)
})

console.log("Ipc PCC running...")
