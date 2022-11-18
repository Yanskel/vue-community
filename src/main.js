import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'


Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.use(ElementUI);

axios.defaults.baseURL = '/api'

//导航守卫
router.beforeEach((to, from, next) => {
  //用户登录信息
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo && to.name !== 'userLogin') {
    next({ name: 'userLogin' })
  } else if (userInfo && to.name === 'userLogin') {
    next({ name: 'main' })
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

