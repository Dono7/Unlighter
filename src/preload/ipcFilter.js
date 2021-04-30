const electron = require("electron")
const { ipcRenderer, contextBridge } = electron

contextBridge.exposeInMainWorld("unlighter", {
	send(channel, data) {
		ipcRenderer.send(channel, data)
	},
	on(channel, func) {
		ipcRenderer.on(channel, (event, ...args) => func(...args))
	},
})
