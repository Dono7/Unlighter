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
  background: linear-gradient(150deg, rgba(32,32,32,1) 0%, rgba(17,17,17,1) 48%)
  color: white

h1
  padding-left: 20px
  font-weight: 500
  font-size: 20px

// Animation on views change
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active
  width: 100%
  position: fixed
  transition: transform 0.15s ease-out

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
