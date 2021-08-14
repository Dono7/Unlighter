import { createRouter, createWebHistory } from "vue-router"
import Monitors from "@/views/Monitors.vue"
import Preferences from "@/views/Preferences.vue"
import About from "@/views/About.vue"
import Updater from "@/views/Updater.vue"
import Filter from "@/views/Filter.vue"
import Loading from "@/views/Loading.vue"
import Help from "@/views/Help.vue"

const routes = [
	{
		path: "/",
		name: "Monitors",
		component: Monitors,
		meta: { transitionIndex: 1 },
	},
	{
		path: "/preferences",
		name: "Preferences",
		component: Preferences,
		meta: { transitionIndex: 2 },
	},
	{
		path: "/about",
		name: "About",
		component: About,
		meta: { transitionIndex: 3 },
	},
	{
		path: "/help",
		name: "Help",
		component: Help,
		meta: { transitionIndex: 4 },
	},
	{
		path: "/updater",
		name: "Updater",
		component: Updater,
		meta: { hideNavigation: true, purpleBg: true },
	},
	{
		path: "/filter",
		name: "Filter",
		component: Filter,
		meta: { hideNavigation: true },
	},
	{
		path: "/loading",
		name: "Loading",
		component: Loading,
		meta: { fadeTransition: true, hideNavigation: true, noBg: true },
	},
	{
		path: "/index.html",
		beforeEnter: (to, from, next) => {
			const redirect = to?.query?.redirect
			if (redirect) {
				next({ path: "/" + redirect })
			} else {
				next({ path: "/" })
			}
		},
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

export default router
