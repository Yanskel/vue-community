<template>
  <div>
    <el-alert title="在提交前请务必确认信息准确无误" type="warning" show-icon v-if="!disabled"></el-alert>
    <el-alert title="今天已完成健康填报" type="success" show-icon :closable="false" v-else></el-alert>
    <div class="box">
      <div>
        <div class="text">*体温情况：</div>
        <el-radio-group v-model="health.temperature">
          <el-radio-button label="0">正常</el-radio-button>
          <el-radio-button label="1">≥37.3</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <div class="text">*新型冠状病毒肺炎主要症状：发热、干咳、乏力、咽痛、嗅（味）觉减退、腹泻等：</div>
        <el-radio-group v-model="health.symptom">
          <el-radio-button label="0">无</el-radio-button>
          <el-radio-button label="1">有</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <div class="text">*健康码颜色：</div>
        <el-radio-group v-model="health.healthColor">
          <el-radio-button label="0">绿码</el-radio-button>
          <el-radio-button label="1">黄码</el-radio-button>
          <el-radio-button label="2">红码</el-radio-button>
          <el-radio-button label="3">弹框</el-radio-button>
          <el-radio-button label="4">其他</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="box">
      <div class="text">*行程卡状态：</div>
      <el-radio-group v-model="health.route">
        <el-radio-button label="0">正常</el-radio-button>
        <el-radio-button label="1">异常</el-radio-button>
      </el-radio-group>
    </div>
    <div class="button">
      <el-button type="primary" @click="submit" :disabled="disabled">提交</el-button>
      <el-button plain @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
// 获取当前时间并格式化
let date = new Date()
let year = date.getFullYear()
let month = date.getMonth() + 1
let day = date.getDate()
month = (month > 9) ? month : ('0' + month)
day = (day < 10) ? ('0' + day) : day
let today = year + '-' + month + '-' + day

export default {
  name: 'HealthPage',
  data() {
    return {
      health: {
        temperature: 0,
        symptom: 0,
        healthColor: 0,
        route: 0,
      },
      disabled: false,
    }
  },
  created() {
    this.check()
  },
  methods: {
    //重置所填写数据
    reset() {
      this.health = {
        temperature: 0,
        symptom: 0,
        healthColor: 0,
        route: 0
      }
    },
    //提交健康信息
    submit() {
      this.axios.post('/healthInfo', this.health)
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.data);
            this.$router.push('/main')
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
    },
    check() {
      this.axios.get('/healthInfo')
        .then(res => {
          if (res.data.code === 1) {
            const data = res.data.data
            for (const item of data) {
              const dataTime = item.submitTime
              const arr = dataTime.trim().split(" ")
              if (arr[0] === today) {
                // 今天已经填报
                this.disabled = true
              }
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
}
</script>

<style lang="less" scoped>
.el-radio-group {
  padding: 20px;
}

.text {
  font-weight: 900;
  padding-left: 20px;
}

.box {
  background-color: white;
  margin: 20px;
  padding-top: 20px;
  border-radius: 10px;
}

.button {
  text-align: center;

  .el-button {
    margin: 10px;
  }
}
</style>