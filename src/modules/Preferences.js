import storage from "electron-json-storage"

export default class Preferences {
	constructor(unlighterApp) {
		this.app = unlighterApp
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

		storage.set("preferences", newPref, (error) => {
			this.onPrefChange(key, value)
		})
	}

	onPrefChange(key, value) {
		if (key === "showScreenNumber") {
			this.app.monitors.showOrHideMonitorIndex(value ? "show" : "hide")
		}

		if (key === "showInTaskbar") {
			this.app.tray.toggleAppInTaskbar(value)
		}
	}

	loadUserPref() {
		this.config = {
			...this.config,
			preferences: {
				...this.getPref(),
			},
		}
	}

	initDefaultPreferences() {
		const userPref = this.getPref()
		if (userPref !== undefined) {
			for (const [key, value] of Object.entries(this.config.defaultConfig)) {
				if (userPref[key] === undefined) {
					userPref[key] = value
					storage.set("preferences", userPref)
				}
			}
		} else {
			storage.set("preferences", this.config.defaultConfig)
		}
	}
}
