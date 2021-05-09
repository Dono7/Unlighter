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
    <button @click="getPref">Get Preferences</button>
  </main>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import InputBlock from './../components/InputBlock'

export default {
  components: { InputBlock },
  name: 'Preferences',
  setup(props) {
    const changePref = (key, value) => {
      window.unlighter.sendToMain({msg: 'preferences-set', key, value})
    }

    const pref = ref([
      {key: 'screenStrength', label: 'Default screen strength on start', value: 9, inputType: 'number', min: 0, max: 100},
      {key: 'showScreenNumber', label: 'Show screen number on hover', value: true, inputType: 'switch'},
      {key: 'minimizeOnBlur', label: 'Automatically minimize', value: true, inputType: 'switch'},
    ])

    function getPref() {
      window.unlighter.sendToMain({msg: 'preferences-get'})
    }

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

    return { pref, changePref, getPref }
  }
}
</script>

<style lang="sass">
.preferences
  display: flex
  flex-direction: column
  gap: 15px
</style>