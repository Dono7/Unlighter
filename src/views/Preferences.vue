<template>
  <main class="preferences">
    <InputBlock
      v-for="p in pref"
      :key="p.key"
      :name="p.key"
      :label="p.label"
      :value="p.value"
      :inputType="p.inputType"
      :min="p.min"
      :max="p.max"
      @valuechange="(...args) => this.changePref(p.key, ...args)"
    />

    <Button label="Search for update" small @click="openUpdaterWindow"/>
  </main>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import InputBlock from './../components/InputBlock'
import Button from './../components/Button'

export default {
  components: { InputBlock, Button },
  name: 'Preferences',
  setup(props) {
    const changePref = (key, value) => {
      window.unlighter.sendToMain({msg: 'preferences-set', key, value})
    }

    const openUpdaterWindow = () => {
      window.unlighter.sendToMain({msg: 'open-updater-window'})
    }

    const pref = ref([
      {key: 'screenStrength', label: 'Default screen strength on start', value: 9, inputType: 'number', min: 0, max: 100},
      {key: 'showScreenNumber', label: 'Show screen number', value: true, inputType: 'switch'},
      // {key: 'pccOnTop', label: 'Always on top (not affected by filters)', value: true, inputType: 'switch'},
      {key: 'minimizeOnBlur', label: 'Automatically minimize', value: true, inputType: 'switch'},
    ])

    onBeforeMount(() => {
      window.unlighter.fromMain('preferences-get', (event, userPref) => {
        pref.value.forEach(p => { 
          if(userPref[p.key] !== undefined) {
            p.value = userPref[p.key]
          }
        })
      })
      
      window.unlighter.sendToMain({msg: 'preferences-get'})
    })

    return { pref, changePref, openUpdaterWindow }
  }
}
</script>

<style lang="sass">
.preferences
  display: flex
  flex-direction: column
  gap: 15px
</style>