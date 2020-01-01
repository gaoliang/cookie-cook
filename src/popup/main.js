import Vue from 'vue'
import App from './App.vue'
import vuetify from '../plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

/* eslint-disable no-new */
new Vue({
  vuetify,
  el: '#app',
  render: h => h(App)
})
