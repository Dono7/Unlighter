<template>
  <main class="about">
    <p>This software is open-source, and free to use. Version beta v0.1.0</p>

    <p>If you want to contribute, please go to the unlighter github repository.</p>
    <Button label="Github repo" url="https://github.com/Dono7/Unlighter" small></Button>

    <p>If you want to contact the developper or the UI/UX designer, please the form below.</p>

    <Button label="Contact form" url="https://forms.gle/8mULUL5qfR5AVJi19" small></Button>
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
  gap: 15px
</style>
