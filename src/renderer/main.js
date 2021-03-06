import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import './assets/css/reset.css'
import './assets/css/common.css'
import './assets/css/main.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
