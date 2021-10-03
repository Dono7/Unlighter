<template>
  <main class="about">
    <p>Unlighter is a free and open-source project. You can download the latest version from the <Link href="https://github.com/Dono7/Unlighter" label="Github Project."/>.</p>

    <p>This application is developped by <Link href="https://github.com/Dono7" label="Donovan T."/> (developper) and <Link href="https://www.behance.net/bourhanewac933" label="Walid B" /> (UI/UX Designer).</p>

    <SearchForUpdate @click="openUpdaterWindow" />

    <Version prefix="Current version "/>
  </main>
</template>

<script>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import Link from '@/components/Link'
import Button from '@/components/Button'
import Version from '@/components/Version'
import SearchForUpdate from '@/components/SearchForUpdate'

export default {
  components: { Link, Button, Version, SearchForUpdate },
  setup() {
    const openUpdaterWindow = () => {
			window.unlighter.execModuleMethod({module: 'Updater', method: 'openWindow'})
    }

    const isUpdateAvailable = ref(false)

    onMounted(() => {
      if(document.querySelector('a.router-link-exact-active.notif') !== null) {
        isUpdateAvailable.value = true
      }
      window.unlighter.once('update-available', () => {
        isUpdateAvailable.value = true
      })
    })

    return { openUpdaterWindow, isUpdateAvailable }
  }
}
</script>

<style lang="sass">
.about
  display: flex
  flex-direction: column
  gap: 12px
  p
    font-size: 12px
</style>
