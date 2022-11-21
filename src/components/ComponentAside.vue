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
import { mapState } from 'vuex';
export default {
  name: 'ComponentAside',
  data() {
    return {
      menuList: [
        {
          path: '/home',
          name: 'home',
          label: '首页',
          icon: 'menu',
        },
        {
          path: '/peopleManage',
          name: 'peopleManage',
          label: '人员管理',
          icon: 'help',
          children: [
            {
              path: '/residentManage',
              name: 'residentManage',
              label: '居民管理',
              icon: 'user',
            },
            {
              path: '/employeeManage',
              name: 'employeeManage',
              label: '员工管理',
              icon: 's-custom',
            }
          ]
        },
        {
          path: '/supplies',
          name: 'supplies',
          label: '物资申请',
          icon: 'goods',
          children: [
            {
              path: '/supApprove',
              name: 'supApprove',
              label: '物资审批',
              icon: 'document-add',
            },
            {
              path: '/record',
              name: 'record',
              label: '申请记录',
              icon: 'postcard',
            }
          ]
        },
        {
          path: '/health',
          name: 'health',
          label: '健康填报',
          icon: 'document',
        },
        {
          path: '/personalHealth',
          name: 'personalHealth',
          label: '个人健康填报记录',
          icon: 'eleme',
        },
        {
          path: '/healthRecord',
          name: 'healthRecord',
          label: '填报记录',
          icon: 's-order',
        },
        {
          path: '/supManage',
          name: 'supManage',
          label: '物资管理',
          icon: 's-management',
        },
        {
          path: '/announcement',
          name: 'announcement',
          label: '系统公告',
          icon: 'chat-line-square',
        },
        {
          path: '/personalApply',
          name: 'personalApply',
          label: '个人物资申请',
          icon: 'folder-add',
        },
      ]
    }
  },
  methods: {
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    // },
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
    // isCollapse(){
    //   return this.$store.state.isCollapse
    // },
    ...mapState(['isCollapse'])
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