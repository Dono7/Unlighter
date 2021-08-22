<template>
  <main class="preferences">
    <InputBlock
      v-for="p in pref"
      :name="p.key"
			v-bind="p"
      @valuechange="(...args) => this.changePref(p.key, ...args)"
    />

    <Button label="Search for update" @click="openUpdaterWindow"/>
  </main>
</template>

<script>
import { onBeforeMount, onUnmounted, ref } from 'vue'
import InputBlock from './../components/InputBlock'
import Button from './../components/Button'

export default {
  components: { InputBlock, Button },
  name: 'Preferences',
  setup(props) {
    const changePref = (key, value) => {
			window.unlighter.execAppMethod({method: 'setPref', args: [key, value]})
    }

    const openUpdaterWindow = () => {
			window.unlighter.execModuleMethod({module: 'updater', method: 'openWindow'})
    }

    const pref = ref([
      {key: 'screenStrength', label: 'Default filters strength on start', value: 9, inputType: 'number', min: 0, max: 100},
      {key: 'showScreenNumber', label: 'Show screen number', value: true, inputType: 'switch'},
      // {key: 'pccOnTop', label: 'Always on top (not affected by filters)', value: true, inputType: 'switch'},
      {key: 'minimizeOnBlur', label: 'Automatically minimize', value: true, inputType: 'switch'},
    ])

    onBeforeMount(() => {
      window.unlighter.on('preferences-get', (event, userPref) => {
        pref.value.forEach(p => { 
          if(userPref[p.key] !== undefined) {
            p.value = userPref[p.key]
          }
        })
      })
      
		  window.unlighter.execAppMethod({method: 'sendToPccFromCode', args: ['preferences-get']})
    })

    onUnmounted(() => {
      window.unlighter.removeListener('preferences-get')
    })

    return { pref, changePref, openUpdaterWindow }
  }
}
</script>

<style lang="sass">

</style>