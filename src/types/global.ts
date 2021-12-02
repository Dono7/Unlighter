import { UnlighterIpc } from "./ipc"

declare global {
	interface Window {
		unlighter: UnlighterIpc
	}
}
