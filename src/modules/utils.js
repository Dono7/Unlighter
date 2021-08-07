/* This method should never be called before the local server is created in the UnlighterApp */
export const openFileInWindow = (browserWindow, htmlFilename, openDetachedDevTools = false) => {
	if (!browserWindow) {
		throw new Error(`Cannot open the file ${htmlFilename} in the window because the window does not exist.`)
	}

	process.env.WEBPACK_DEV_SERVER_URL
		? browserWindow.loadFile(`./../public/${htmlFilename}.html`)
		: browserWindow.loadURL(`app://./${htmlFilename}.html`)

	if (openDetachedDevTools) {
		browserWindow.webContents.openDevTools({ mode: "detached" })
	}
}
