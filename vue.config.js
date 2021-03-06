module.exports = {
	pluginOptions: {
		electronBuilder: {
			preload: { ipcPcc: "src/preload/ipcPcc.js" },
			builderOptions: {
				appId: "com.Unlighter.unlighter",
				productName: "Unlighter",
				win: {
					target: ["nsis"],
					certificateSubjectName: "Unlighter",
					signingHashAlgorithms: ["sha256"],
					publisherName: "Unlighter",
					signAndEditExecutable: true,
					verifyUpdateCodeSignature: true,
				},
				nsis: {
					artifactName: "Unlighter-Setup-${version}.${ext}",
					createDesktopShortcut: "always",
					createStartMenuShortcut: true,
					shortcutName: "Unlighter",
				},
				directories: {
					buildResources: "resources",
				},
				publish: {
					provider: "github",
					owner: "Dono7",
					releaseType: "draft",
				},
			},
		},
	},
	configureWebpack: {
		devtool: "source-map",
	},
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "@/assets/sass/main.sass"`,
			},
		},
	},
}
