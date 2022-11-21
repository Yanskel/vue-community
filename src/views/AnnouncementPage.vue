<template>
  <div class="main">
    <div class="div-inline left" style="width:60%">
      <el-form label-position="top" label-width="80px" :model="formData">
        <el-form-item label="标题">
          <el-input v-model="formData.title" style="width:200px" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 20 }" placeholder="请输入内容"
            v-model="formData.notice">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">立即提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="div-inline" style="width:40%">
      <div class="block">
        <el-timeline>
          <el-timeline-item v-for="a in announcement" :timestamp="a.announceTime" placement="top" :key="a.id">
            <el-card>
              <h4>{{a.title}}</h4>
              <p>{{a.notice}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      formData: {},
      announcement: []
    }
  },
  mounted() {
    this.notification()
  },
  methods: {
    submit() {
      this.axios.post('/announcement', this.formData)
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.data)
            this.formData = {}
            this.notification()
          } else {
            this.$message.error('提交失败')
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    notification() {
      this.axios.get('/announcement')
        .then(res => {
          if (res.data.code === 1) {
            this.announcement = res.data.data.slice(0, 3)
            console.log(this.announcement)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
  },
}
</script>

<style lang="less" scoped>
.div-inline {
  display: inline-block;
}
.el-card__body{
  padding: 10px;
}
</style>