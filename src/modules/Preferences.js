import storage from "electron-json-storage"

export default class Preferences {
	constructor(unlighterApp) {
		this.app = unlighterApp

		this.initDefaultPreferences()
	}

	getData(key) {
		return storage.getSync(key)
	}

	getPref(key = "") {
		return key == "" ? this.getData("preferences") : this.getData("preferences")[key]
	}

	setPref(key, value) {
		let newPref = this.getPref()
		if (key !== undefined && value !== undefined) {
			newPref[key] = value
		}

		storage.set("preferences", newPref, { prettyPrinting: true }, (error) => {
			if (!error) {
				this.app.Pcc.send("pref-changed-confirmation")
				this.onPrefChange(key, value)
			}
		})
	}

	onPrefChange(key, value) {
		if (key === "showScreenNumber") {
			this.app.Monitors.showOrHideMonitorIndex(value ? "show" : "hide")
		}

		if (key === "showInTaskbar") {
			this.app.Tray.toggleAppInTaskbar(value)
		}

		if (key === "enableShortcuts") {
			if (value) {
				this.app.Shortcuts.bindShortcuts()
			} else {
				this.app.Shortcuts.unbindShortcuts()
			}
		}
	}

	initDefaultPreferences() {
		const defaultConfig = this.app.config.defaultConfig
		const userPref = this.getPref()
		const newPref = { ...defaultConfig, ...userPref }
		storage.set("preferences", newPref, { prettyPrinting: true })
	}
}
