<template>
  <main class="about">
    <p>Unlighter is a free and open-source project. You can download the latest version</p>

    <p><a href="https://github.com/Dono7/Unlighter/releases" target="_blank">Download from Github</a></p>

    <p>This application is developped by <a href="">Donovan T.</a> (developper) and <a href="">Walid B.</a> (UI/UX Designer).</p>

  </main>
</template>

<script>
import Button from './../components/Button'

export default {
  components: { Button },
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
