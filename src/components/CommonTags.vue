<template>
  <div class="tag">
    <el-tag v-for="(t, index) in tabsList" :key="t.name" 
      :effect="$route.name === t.name ? 'dark' : 'plain'"
      :closable="t.name !== 'home'" 
      @click="changeMenu(t)" 
      @close="closeTag(t, index)"
      size="medium">
      {{ t.label }}
    </el-tag>
    <el-divider></el-divider>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'CommonTags',
  data() {
    return {

    }
  },
  computed: {
    ...mapState(['tabsList'])
  },
  methods: {

    //tag跳转
    changeMenu(tag) {
      this.$router.push({ name: tag.name })
    },
    //删除tag
    closeTag(tag, index) {
      this.$store.commit('CLOSE_TAG', tag)
      //删除之后的跳转
      if (tag.name !== this.$route.name) {
        return
      }
      if (index === this.tabsList.length) {
        this.$router.push({
          name: this.tabsList[index - 1].name
        })
      } else {
        this.$router.push({
          name: this.tabsList[index].name
        })
      }
    }
  },
}
</script>

<style lang="less" scoped>
.tag {
  height: 45px;
  padding: 15px 0 0 15px;
  background-color: aliceblue;
  .el-tag{
    margin-right: 15px;
    cursor: pointer;
  }
  .el-divider--horizontal{
    margin: 15px 0;
  }
}
</style>