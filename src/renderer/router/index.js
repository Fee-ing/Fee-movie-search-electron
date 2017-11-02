import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/search', component: require('../views/index')
  }, {
    path: '/', redirect: '/search'
  }, {
    path: '*', redirect: '/search'
  }]
})

export default router
