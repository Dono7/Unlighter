const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("unlighter", {
	sendToMonitors(data) {
		ipcRenderer.send("pcc-to-monitors", data)
	},
	sendToMain(data) {
		ipcRenderer.send("pcc-to-main", data)
	},
	fromMain(channel, callback) {
		ipcRenderer.on(channel, callback)
	},
})
