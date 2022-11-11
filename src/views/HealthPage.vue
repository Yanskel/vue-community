<template>
  <div>
    <el-alert title="在提交前请务必确认信息准确无误" type="warning" show-icon></el-alert>
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
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button plain @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HealthPage',
  data() {
    return {
      health: {
        temperature: 0,
        symptom: 0,
        healthColor: 0,
        route: 0
      }
    }
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
      this.axios.post('/healthInfo',this.health)
      .then(res => {
        if(res.data.code === 1){
          this.$message.success(res.data.data);

        }
      })
      .catch(err => {
        this.$message.error(err);
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