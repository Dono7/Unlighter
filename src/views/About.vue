<template>
  <main class="about">
    <p>Unlighter is a free and open-source project. You can download the latest version from the <Link href="https://github.com/Dono7/Unlighter" label="Github Project."/>.</p>

    <p>This application is developped by <Link href="https://github.com/Dono7" label="Donovan T."/> (developper) and <Link href="https://www.behance.net/bourhanewac933" label="Walid B" /> (UI/UX Designer).</p>
    
    <Button label="Search for update" @click="openUpdaterWindow"/>

    <Version />
  </main>
</template>

<script>
import { onBeforeMount, onUnmounted, ref } from 'vue'
import Link from '@/components/Link'
import Button from '@/components/Button'
import Version from '@/components/Version'

export default {
  components: { Link, Button, Version },
  setup() {
    const openUpdaterWindow = () => {
			window.unlighter.execModuleMethod({module: 'updater', method: 'openWindow'})
    }

    return { openUpdaterWindow }
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
