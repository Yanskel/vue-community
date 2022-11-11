import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userForm: {},//传递用户参数
    isCollapse: false,//菜单收起与展开
    tabsList: [
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'menu',
      }
    ],//面包屑
  },
  getters: {
  },
  mutations: {
    ADD_LOGIN(state, value) { //完善个人信息
      state.userForm = value
    },
    COLLAPSE_MENU(state) { //更改菜单栏状态
      state.isCollapse = !state.isCollapse
    },
    SELECT_MENU(state, value) { //更新面包屑
      if (value.name !== 'home') {
        const index = state.tabsList.findIndex(item => item.name === value.name)
        if (index === -1) {
          state.tabsList.push(value)
        }
      }
    },
    CLOSE_TAG(state, value) {
      const index = state.tabsList.findIndex(item => item.name === value.name)
      state.tabsList.splice(index, 1)
    }
  },
  actions: {
  },
  modules: {
  }
})
