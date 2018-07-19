// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('!!script-loader!ASSET/fonts/iconfont')
import Vue from 'vue'
import App from './app'
import router from './routers'
// import 'UTIL/flexible'
// import Alert from 'COMPONENT/alert'
// Vue.component('my-alert', Alert)

import SVG from 'COMPONENT/v-svg'
Vue.component('v-svg', SVG)

// console.time('执行时间')
// console.timeEnd('执行时间')

import VueLazyload from 'vue-lazyload'
// import loading from 'ASSET/img/loading.png'
// import error from 'ASSET/img/error.png'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'https://luuman.github.io/apple-touch-icon.png',
  loading: 'https://luuman.github.io/apple-touch-icon.png',
  // listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend'],
  attempt: 1
})

// import VueScroller from 'vue-scroller'
// Vue.use(VueScroller)

// import vueTap from 'v-tap'
// Vue.use(vueTap)

// import Alert from 'vue-alerts'
// Vue.use(Alert)

// import progressive from 'progressive-image/dist/vue'
// Vue.use(progressive, {
//   removePreview: true
// })
// Vue.config.productionTip = false

// import store from 'VUEX/store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  template: '<App/>',
  components: {
    // Alert,
    App
  }
})
