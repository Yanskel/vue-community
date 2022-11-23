import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userForm: {},  //传递用户参数
    isCollapse: false,  //菜单收起与展开
    tabsList: [    //面包屑
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'menu',
      }
    ],
    menuList: [
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'menu',
      }
    ]
  },
  getters: {
  },
  mutations: {
    ADD_LOGIN(state, value) {   //完善个人信息
      state.userForm = value
    },
    COLLAPSE_MENU(state) {   //更改菜单栏状态
      state.isCollapse = !state.isCollapse
    },
    SELECT_MENU(state, value) {   //更新面包屑
      if (value.name !== 'home') {
        const index = state.tabsList.findIndex(item => item.name === value.name)
        if (index === -1) {
          state.tabsList.push(value)
        }
      }
    },
    CLOSE_TAG(state, value) {  //关闭标签实现动态跳转
      const index = state.tabsList.findIndex(item => item.name === value.name)
      state.tabsList.splice(index, 1)
    },
    SET_MENU(state, value) {  //设置菜单数据
      value.forEach(item => {
        state.menuList.push(item)
      })
      Cookies.set('menu', JSON.stringify(state.menuList))
    },
    DEL_MENU(state) {   //删除菜单
      state.menuList = [
        {
          path: '/home',
          name: 'home',
          label: '首页',
          icon: 'menu',
        }
      ]
    },
    // ADD_MENU(state) {
    //   if (!Cookies.get('menu')) return
    //   const menu = JSON.parse(Cookies.get('menu')) 
    //   state.menuList = menu
    //   const menuArray = []
    //   menu.forEach(item => {
    //     if (item.children) {
    //       item.children = item.children.map(item => {
    //         item.component = () => import(`../views/${item.url}`)
    //         return item
    //       })
    //       menuArray.push(...item.children)
    //     } else {
    //       item.component = () => import(`../views/${item.url}`)
    //       menuArray.push(item)
    //     }
    //   });
    //   console.log(menuArray)
    // }
  },
  actions: {
  },
  modules: {
  }
})
