import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/reset.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'


Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.use(ElementUI);

axios.defaults.baseURL='/api'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

