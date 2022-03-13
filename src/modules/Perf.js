import config from "./../config.json"
import logger from "electron-log"

const perfStart = performance.now()

const perfDisplay = (text) => {
	if (config.showPerf)
		logger.log(`${Math.round(performance.now() - perfStart)}ms : ${text}`)
}

export { perfDisplay }
