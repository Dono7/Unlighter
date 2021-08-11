<template>
  <main class="about">
    <p>Unlighter is a free and open-source project. You can download the latest version on Github</p>

    <p><Button href="https://github.com/Dono7/Unlighter/releases" label="Download from Github"/></p>

    <p>This application is developped by <Link href="https://github.com/Dono7" label="Donovan T."/> (developper) and <Link href="https://www.behance.net/bourhanewac933" label="Walid B" /> (UI/UX Designer).</p>

    <p v-if="version" class="minor">v{{version}}</p>
  </main>
</template>

<script>
import Link from './../components/Link'
import Button from './../components/Button'
import { onBeforeMount, onUnmounted, ref } from 'vue'

export default {
  components: { Link, Button },
  setup() {
    const version = ref(null)

    onBeforeMount(() => {
      window.unlighter.on('app-version', (event, v) => {
        version.value = v
      })

      window.unlighter.execModuleMethod({module: "updater", method: 'sendVersion'})
    })

    onUnmounted(() => {
      window.unlighter.removeListener('app-version')
    })

    return { version }
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
