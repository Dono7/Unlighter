<template>
	<main class="help">
    <h1>Multi-Drag</h1>

    <img src="@/assets/gif/multidrag.gif">

    <p class="description">Clic and drag throught multiple monitors bar to synchronise them.</p>

		<h1>Shortcuts</h1>

    <InputBlock
      v-for="p in pref"
      :name="p.key"
			v-bind="p"
      smallmargin
      @valuechange="(...args) => this.changePref(p.key, ...args)"
    />

	</main>
</template>

<script>
import { ref } from 'vue'
import InputBlock from './../components/InputBlock'

export default {
  components: { InputBlock },
	setup() {

		const pref = ref([
      {key: 'decrease', label: 'Decrease filters by 5', inputType: 'showString', text: 'Alt+F2'},
      {key: 'increase', label: 'Increase filters by 5', inputType: 'showString', text: 'Alt+F3'},
    ])

		return { pref }
	}
}
</script>

<style lang="sass" scoped>
.description
  margin: 5px 0 20px
</style>
