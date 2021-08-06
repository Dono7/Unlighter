<template>
  <main class="about">
    <p>Unlighter is a free and open-source project. You can download the latest version on Github :</p>

    <p><Link href="https://github.com/Dono7/Unlighter/releases" label="Download from Github"/></p>

    <p>This application is developped by <Link href="https://github.com/Dono7" label="Donovan T."/> (developper) and <Link href="https://www.behance.net/bourhanewac933" label="Walid B" /> (UI/UX Designer).</p>

  </main>
</template>

<script>
import Link from './../components/Link'

export default {
  components: { Link },
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
