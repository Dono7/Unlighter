module.exports = {
	pluginOptions: {
		electronBuilder: {
			preload: { ipcPcc: "src/preload/ipcPcc.js", ipcFilter: "src/preload/ipcFilter.js" },
		},
	},
	configureWebpack: {
		devtool: "source-map",
	},
}
