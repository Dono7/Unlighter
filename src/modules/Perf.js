const perfStart = performance.now()

const perfDisplay = (text) =>
	console.log(`${Math.round(performance.now() - perfStart)}ms : ${text}`)

export { perfDisplay }
