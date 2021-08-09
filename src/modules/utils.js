/* This method should never be called before the local server is created in the UnlighterApp */
export const openFileInWindow = (browserWindow, path, openDetachedDevTools = false) => {
	if (!browserWindow) {
		throw new Error(`Cannot open the path ${path} in the window because the window does not exist.`)
	}

	process.env.WEBPACK_DEV_SERVER_URL
		? browserWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${path}`)
		: browserWindow.loadURL(`app://./${path}`)

	if (openDetachedDevTools) {
		browserWindow.webContents.openDevTools({ mode: "detached" })
	}
}
