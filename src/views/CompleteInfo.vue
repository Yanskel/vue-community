<template>
  <div id="infoForm">
    <div class="headline">
      请完善个人信息
    </div>
    <div class="content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="身份证号" prop="idNuimber">
          <el-input v-model="ruleForm.idNumber"></el-input>
        </el-form-item>

        <el-form-item label="居住小区" prop="region">
          <el-select v-model="ruleForm.acId" placeholder="请选择现居住小区" filterable>
            <el-option v-for="r in region" :key="r.id" :label="r.acName" :value="r.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CompleteInfo',
  data() {
    return {
      ruleForm: {
        name: '',
        idNumber: '',
        acId: ''
      },
      region: [],
      rules: {
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { min: 18, max: 18, message: '请输入正确的身份证号码', trigger: 'blur' }
        ],
        acId: [
          { required: true, message: '请选择居住的小区', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['userForm'])
  },
  mounted() {
    this.axios.get('/apartmentComplex')
      .then(res => {
        this.region = res.data.data
      })
      .catch(err => {
        this.$message.error(err);
      })
  },
  methods: {
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.id = this.userForm.id
          this.ruleForm.username = this.userForm.username
          this.ruleForm.password = this.userForm.password
          this.ruleForm.phone = this.userForm.phone
          this.axios.put('/user', this.ruleForm)
            .then(res => {
              if (res.data.code === 1) {
                this.$message.success('提交成功');
              } else {
                this.$message.success('提交失败');
              }
            })
            .catch(err => {
              this.$message.error(err);
            })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
}
</script>

<style scoped>
#infoForm {
  width: 30%;
  height: 50%;
  background-color: white;
  position: absolute;
  left: 35%;
  margin-top: 10%;
  border-radius: 20px;
}

.headline {
  margin-top: 10%;
  margin-bottom: 10%;
  text-align: center;
  font-size: 20px;
}

.content .el-input {
  width: 90%;
}
</style>