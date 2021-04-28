module.exports = {
	pluginOptions: {
		electronBuilder: {
			preload: { ipcPcc: "src/preload/ipcPcc.js" },
		},
	},
	configureWebpack: {
		devtool: "source-map",
	},
}
