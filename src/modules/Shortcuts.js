import { globalShortcut } from "electron"

export default class Shortcuts {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.areShortcutsBinded = false
	}

	bindShortcuts() {
		globalShortcut.register("Alt+F2", () => {
			this.app.monitors.shortcutTriggered("decrease", 5)
		})
		globalShortcut.register("Alt+F3", () => {
			this.app.monitors.shortcutTriggered("increase", 5)
		})
		this.areShortcutsBinded = true
	}

	unbindShortcuts() {
		globalShortcut.unregisterAll()
		this.areShortcutsBinded = false
	}
}
