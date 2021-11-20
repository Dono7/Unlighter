import { createRouter, createWebHistory } from "vue-router"
import Pcc from "@/views/Pcc.vue"
import Updater from "@/views/Updater.vue"
import Filter from "@/views/Filter.vue"
import Preferences from "@/views/menu/Preferences.vue"
import Update from "@/views/menu/Update.vue"
import About from "@/views/menu/About.vue"
import Help from "@/views/menu/Help.vue"

const routes = [
	{
		path: "/",
		name: "Pcc",
		component: Pcc,
		children: [
			{
				path: "preferences",
				name: "Preferences",
				component: Preferences,
			},
			{
				path: "update",
				name: "Update",
				component: Update,
			},
			{
				path: "about",
				name: "About",
				component: About,
			},
			{
				path: "help",
				name: "Help",
				component: Help,
			},
		],
	},
	{
		path: "/updater",
		name: "Updater",
		component: Updater,
	},
	{
		path: "/filter",
		name: "Filter",
		component: Filter,
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
