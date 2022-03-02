import config from "./../config.json"

const perfStart = performance.now()

const perfDisplay = (text) => {
	if (config.showPerf)
		console.log(`${Math.round(performance.now() - perfStart)}ms : ${text}`)
}

export { perfDisplay }
