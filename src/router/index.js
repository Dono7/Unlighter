import { createRouter, createWebHistory } from "vue-router"
import Pcc from "@/views/Pcc.vue"
import Updater from "@/views/Updater.vue"
import Filter from "@/views/Filter.vue"
import Loading from "@/views/Loading.vue"

const routes = [
	{
		path: "/",
		name: "Pcc",
		component: Pcc,
		children: [
			{
				path: "preferences",
			},
			{
				path: "update",
			},
			{
				path: "about",
			},
			{
				path: "help",
			},
		],
	},
	{
		path: "/loading",
		name: "Loading",
		component: Loading,
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
