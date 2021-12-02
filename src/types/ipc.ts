export type UnlighterIpc = {
	execModuleMethod: (data: { module: string; method: string; args?: [] }) => void
	on: (channel: string, callback: Function) => void
	once: (channel: string, callback: Function) => void
	removeListener: (channel: string) => void
	openUrl: (url: string) => void
}
