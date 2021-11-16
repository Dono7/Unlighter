<script setup>
import TitleBar from "@/components/TitleBar.vue"
import NavBar from "@/components/NavBar.vue"
import StoreHandler from "@/components/StoreHandler"
import { ref, onBeforeMount } from "vue"
import { useRouter, useRoute } from "vue-router"

const direction = ref("slide-left")
const mode = ref("")
const router = useRouter()
const route = useRoute()

router.beforeEach((to, from) => {
	direction.value =
		from.name === undefined
			? ""
			: from.meta.fadeTransition || to.meta.fadeTransition
			? "fade"
			: to.meta.transitionIndex < from.meta.transitionIndex
			? "slide-left"
			: "slide-right"
	mode.value = from.meta.fadeTransition || to.meta.fadeTransition ? "" : ""
})

onBeforeMount(() => {
	window.unlighter.on("go-to", (event, name) => {
		router.replace({ name })
	})
})
</script>

<template>
	<StoreHandler />
	<div
		id="window"
		:class="{ 'purple-bg': route.meta.purpleBg, 'no-bg': route.meta.noBg }"
	>
		<TitleBar v-if="!route.meta.hideNavigation" />
		<NavBar v-if="!route.meta.hideNavigation" />
		<router-view v-slot="{ Component }">
			<transition :name="direction" :mode="mode">
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>

<style lang="sass">
*
  margin: 0
  padding: 0
  box-sizing: border-box
  user-select: none
  font-family: 'Poppins'

body
  margin: 0
  position: relative
  width: 100%
  height: 100vh
  font-family: 'Poppins'
  background-color: #111
  font-weight: 500
  overflow: hidden

#window
  width: 320px
  min-height: 400px
  background: $background
  color: white
  &.purple-bg
    background: $background
  &.no-bg
    background: transparent
  > main
    padding: 0 30px 10px 30px
    width: 100%
    max-height: 251px
    overflow: auto
    &::-webkit-scrollbar
      display: none
    p
      font-size: 12px
      &.minor
        font-size: 11px
        color: #CCC
  .notif
    position: relative
    &::before
      content: ''
      position: absolute
      top: -2px
      right: -4px
      height: 4px
      width: 4px
      border-radius: 10px
      background-color: $primary

h1
  margin-bottom: 15px
  font-weight: 500
  font-size: 20px

// Animation on views change
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active
  width: 320px
  position: fixed
  transition: transform 0.3s cubic-bezier(0.18,0.53,0.2,1)

.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from
  transform: translateX(0%)

.slide-left-enter-from, .slide-right-leave-to
  transform: translateX(-100%)

.slide-left-leave-to, .slide-right-enter-from
  transform: translateX(100%)


.fade-enter-active,
.fade-leave-active
  transition: opacity 0.2s ease-in-out

.fade-enter-from,
.fade-leave-to
  opacity: 0
</style>
