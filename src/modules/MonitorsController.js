const Monitor = require("./Monitor")

class MonitorsController {
	constructor(displays) {
		this.monitors = displays.map((display) => new Monitor(display))
		this.lastErrorTime = 0
	}

	initWindows() {
		this.monitors.forEach((monitor) => {
			monitor.initWindow()
		})
	}

	serializeForPcc() {
		return this.monitors.map((monitor) => monitor.serialize())
	}

	updateMonitorsStr(monitorsStr) {
		if (monitorsStr.length !== this.monitors.length) {
			if (new Date() - this.lastErrorTime > 10000) {
				this.lastErrorTime = new Date()
				throw new Error("Number of monitors in PCC and in the app are not the same.")
			}
		}
		this.monitors.forEach((monitor, index) => {
			monitor.updateStr(monitorsStr[index])
		})
	}

	log() {
		this.monitors.forEach((monitor) => {
			console.log(monitor)
		})
	}
}

module.exports = MonitorsController
