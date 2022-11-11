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
      <el-dropdown>
        <span class="el-dropdown-link text">
          {{ userForm.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item divided>退出</el-dropdown-item>
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

    }
  },
  methods: {
    changeMenu() {
      this.$store.commit('COLLAPSE_MENU')
    }
  },
  computed: {
    ...mapState(['tabsList', 'userForm'])
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