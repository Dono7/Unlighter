/* This method should never be called before the local server is created in the UnlighterApp */
export const openFileInWindow = (browserWindow, path = "") => {
	if (!browserWindow) {
		throw new Error(`Cannot open the path ${path} in the window because the window does not exist.`)
	}

	const url = process.env.WEBPACK_DEV_SERVER_URL
		? `${process.env.WEBPACK_DEV_SERVER_URL}${path}`
		: `app://./index.html?redirect=${path}`

	browserWindow.loadURL(url)
}
