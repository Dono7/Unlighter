<template>
  <main class="preferences">
    <SwitchBlock
      v-for="p in pref"
      :key="p.key"
      :name="p.key"
      :label="p.label"
      :value="p.value"
      @valuechange="(...args) => this.changePref(p.key, ...args)"
    />
  </main>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import SwitchBlock from './../components/SwitchBlock'

export default {
  components: { SwitchBlock },
  name: 'Preferences',
  setup(props) {
    const changePref = (key, value) => {
      window.unlighter.sendToMain({msg: 'preferences-set', key, value})
    }

    const pref = ref([
      {key: 'showScreenNumber', label: 'Show screen number on hover', value: true}
    ])

    onBeforeMount(() => {
      window.unlighter.fromMain('preferences-get', (event, userPref) => {
        pref.value.forEach(p => { if(userPref[p.key] !== undefined) p.value = userPref[p.key] })
      })
      
      window.unlighter.sendToMain({msg: 'preferences-get'})
    })

    return { pref, changePref }
  }
}
</script>
