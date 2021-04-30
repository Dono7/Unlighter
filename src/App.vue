<template>
  <div id="window">
    <TitleBar />
    <NavBar />
      <router-view v-slot="{ Component }"  >
        <transition :name="direction">
          <component :is="Component"/>
        </transition>
      </router-view>
  </div>
</template>

<script>
import TitleBar from './components/TitleBar.vue'
import NavBar from './components/NavBar.vue'

export default {
  components: { TitleBar, NavBar },
  data() {
    return {
      direction: 'slide-left',
      properties: {
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.direction = from.name === undefined
        ? ''
        : to.meta.transitionIndex < from.meta.transitionIndex
          ? 'slide-left'
          : 'slide-right'
    }
  }
}
</script>

<style lang="sass">
* 
  margin: 0
  padding: 0
  box-sizing: border-box
  letter-spacing: 0.6px
  user-select: none

body, html
  margin: 0
  background-color: #888
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
  background: linear-gradient(150deg, rgba(28,28,28,1) 0%, rgba(17,17,17,1) 42%)
  color: white

h1
  padding-left: 20px
  font-weight: 500
  font-size: 20px

main
  padding: 0 15px

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


</style>
