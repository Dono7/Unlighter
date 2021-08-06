module.exports = {
	pluginOptions: {
		electronBuilder: {
			preload: { ipcPcc: "src/preload/ipcPcc.js", ipcFilter: "src/preload/ipcFilter.js" },
			builderOptions: {
				appId: "com.Unlighter.unlighter",
				productName: "Unlighter",
				win: {
					target: [ "nsis" ]
				},
				nsis: {
					artifactName: "Unlighter-Setup-${version}.${ext}",
					createDesktopShortcut: "always",
					createStartMenuShortcut: true,
					shortcutName: "Unlighter"
				},
				directories: {
				  buildResources: "resources"
				},
				publish: {
					provider: "github",
					owner: "Dono7",
					releaseType: "draft",
				},
			}
		},
	},
	configureWebpack: {
		devtool: "source-map",
	},
}
