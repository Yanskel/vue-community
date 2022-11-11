<template>
  <el-container class="all">
    <!-- 菜单栏 -->
    <component-aside />
    <el-container>

      <el-header class="header">
        <component-header />
      </el-header>
      
      <common-tags/>
      <el-main class="main">
        <router-view></router-view>
      </el-main>

    </el-container>

  </el-container>
</template>

<script>
import ComponentAside from '@/components/ComponentAside.vue';
import ComponentHeader from '@/components/ComponentHeader.vue';
import CommonTags from '@/components/CommonTags.vue';

export default {
  components: { ComponentAside, ComponentHeader, CommonTags },
  name: 'MainMenu',
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.all {
  width: 100%;
  height: 100%;

  .el-header {
    padding: 0;
  }
}

.main {
  background-color: aliceblue;
}
</style>