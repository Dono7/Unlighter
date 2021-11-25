<script setup>
import NavBar from "@/components/NavBar.vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { onMounted } from "vue"

const router = useRouter()
const store = useStore()
const initialRouteName = store.state.menu.lastRouteNameOpened

router.afterEach((to) => {
	if (to.matched[0].name === "Pcc" && to.matched.length === 2) {
		store.commit("menu/menuRouteOpened", to.name)
	}
})

onMounted(() => {
	router.push({ name: initialRouteName })
})
</script>

<template>
	<div class="menu-container">
		<NavBar />
		<div class="menu-content">
			<router-view></router-view>
		</div>
	</div>
</template>

<style lang="sass" scoped>
.menu-container
	position: absolute
	top: 0
	left: 0
	height: 100%
	width: 100%
	max-height: 100%
	background: $background
	overflow: hidden
	z-index: 5
	.menu-content
		padding: 0 28px
		max-height: 310px
		overflow-x: auto
		&::-webkit-scrollbar
      display: none
</style>
