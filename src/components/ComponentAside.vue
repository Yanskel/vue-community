<template>
  <el-menu default-active="1" class="el-menu-vertical-demo"
    :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <h3>{{ isCollapse ? '社区' : '社区疫情防控系统' }}</h3>
    <el-menu-item v-for="n in noChildren" :key="n.name" :index="n.name" @click="clickMenu(n)">
      <i :class="`el-icon-${n.icon}`"></i>
      <span slot="title">{{ n.label }}</span>
    </el-menu-item>

    <el-submenu v-for="h in hasChildren" :key="h.name" :index="h.name">
      <template slot="title">
        <i :class="`el-icon-${h.icon}`"></i>
        <span slot="title">{{ h.label }}</span>
      </template>
        <el-menu-item @click="clickMenu(c)" v-for="c in h.children" :key="c.name" :index="c.name">
          <i :class="`el-icon-${c.icon}`"></i>
          {{ c.label }}
        </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import Cookies from 'js-cookie'
import { mapState } from 'vuex'
export default {
  name: 'ComponentAside',
  mounted() {
    
  },
  methods: {
    //菜单路由跳转
    clickMenu(menu) {
      if (this.$route.path !== menu.path && !(this.$route.path === '/home' && (menu.path === '/main'))) {
        this.$router.push(menu.path)
      }
      this.$store.commit('SELECT_MENU', menu)
    }
  },
  computed: {
    noChildren() {
      return this.menuList.filter(item => !item.children)
    },
    hasChildren() {
      return this.menuList.filter(item => item.children)
    },
    menuList(){
      return JSON.parse(Cookies.get('menu'))|| this.$store.state.menuList
    },
    ...mapState(['isCollapse']),
  }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

h3 {
  color: #fff;
  padding: 22px 0 22px 0;
  text-align: center;
}

.el-menu {
  border: 0;
}
</style>