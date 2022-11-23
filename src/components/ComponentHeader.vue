<template>
  <div class="header-container">

    <div class="l-content">
      <el-button style="margin-right: 20px;" icon="el-icon-menu" size="mini" @click="changeMenu"></el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="t in tabsList" :key="t.name" :to="{ path: t.path }">{{ t.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="r-content">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link text">
          <i class="el-icon-user"></i>
          {{ userInfo.name || '管理员'}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="userInfo.role === 0" command="personalCenter">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'ComponentHeader',
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    changeMenu() {
      this.$store.commit('COLLAPSE_MENU')
    },
    //退出
    handleCommand(command) {
      if (command === 'logout') {
        this.axios.post('/user/logout')
          .then(res => {
            if (res.data.code === 1) {
              localStorage.removeItem('userInfo')
              this.$store.commit('DEL_MENU')
              this.$message.info(res.data.data)
              this.$router.push('/')
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      }else if(command === 'personalCenter'){
        this.$router.push('/personalCenter')
      }
    }
  },
  created() {
    const userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo)
    }
  },
  computed: {
    ...mapState(['tabsList'])
  }
}
</script>

<style lang="less" scoped>
.header-container {
  padding: 0 20px;
  background-color: rgb(71, 66, 66);
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text {
    font-size: 14px;
    color: #fff;
    margin-left: 10px;
  }

  .l-content {
    display: flex;
    align-items: center;

    /deep/.el-breadcrumb__item {
      .el-breadcrumb__inner {
        &.is-link {
          color: rgb(144, 139, 139);
          font-weight: normal;
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          color: #fff;
        }
      }
    }
  }
}
</style>