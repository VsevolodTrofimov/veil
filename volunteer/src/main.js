import Vue from 'vue'
import Vuex from 'vuex'
import VueMaterial from 'vue-material'
import App from './App.vue'

import 'vue-material/dist/vue-material.css'

Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
  primary: 'teal',
  accent: 'brown',
  warn: 'amber',
  background: {
    color: 'grey',
    hue: 50
  }
})

Vue.material.registerTheme('binary', {
  primary: {
    color: 'green',
    hue: 600,
    textColor: 'white'
  },
  warn: 'red',
})

new Vue({
  el: '#app',
  render: h => h(App)
})