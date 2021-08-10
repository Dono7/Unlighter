import { createRouter, createWebHistory } from "vue-router"
import Monitors from "@/views/Monitors.vue"
import Preferences from "@/views/Preferences.vue"
import About from "@/views/About.vue"
import Contact from "@/views/Contact.vue"
import Updater from "@/views/Updater.vue"
import Filter from "@/views/Filter.vue"

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
		path: "/contact",
		name: "Contact",
		component: Contact,
		meta: { transitionIndex: 4 },
	},
	{
		path: "/updater",
		name: "Updater",
		component: Updater,
		meta: { hideNavigation: true },
	},
	{
		path: "/filter",
		name: "Filter",
		component: Filter,
		meta: { hideNavigation: true },
	},
	{
		path: "/index.html",
		beforeEnter: (to, from, next) => {
			const redirect = to?.query?.redirect
			console.log(redirect)
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
