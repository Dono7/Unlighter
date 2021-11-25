import { globalShortcut } from "electron"

export default class Shortcuts {
	constructor(unlighterApp) {
		this.app = unlighterApp
		this.areShortcutsBinded = false

		this.increase = 5
		this.decrease = -5
	}

	bindShortcuts() {
		globalShortcut.register("Alt+F2", () => {
			this.app.Pcc.addStrToAllFilters(this.decrease)
		})
		globalShortcut.register("Alt+F3", () => {
			this.app.Pcc.addStrToAllFilters(this.increase)
		})
		this.areShortcutsBinded = true
	}

	unbindShortcuts() {
		globalShortcut.unregisterAll()
		this.areShortcutsBinded = false
	}
}
