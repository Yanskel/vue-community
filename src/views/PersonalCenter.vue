<template>
  <div>
    <el-alert title="请填写真实的个人信息" type="info" show-icon :closable="false">
    </el-alert>
    <h3>个人中心</h3>
    <div class="form">
      <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="100px" class="demo-ruleForm" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="userInfo.idNumber"></el-input>
        </el-form-item>
        <el-form-item label="居住小区" prop="acId">
          <el-select v-model="userInfo.acId" placeholder="请选择所居住的小区">
            <el-option v-for="a in apartmentComplex" :label="a.acName" :value="a.id" :key="a.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!changePass">
          <el-link type="primary" @click="openChange">修改密码</el-link>
        </el-form-item>
        <el-form-item label="新密码" prop="password" v-show="changePass" key="password" v-if="changePass">
          <el-input type="password" v-model="userInfo.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('userInfo')">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      rules: {
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 18, max: 18, message: '请输入正确的身份证号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度应为8~16位', trigger: 'blur' }
        ],
      },
      apartmentComplex: [],
      changePass: false
    }
  },
  mounted() {
    const userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo)
    }
    this.getAllAc()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.put('/user', this.userInfo)
            .then(res => {
              if (res.data.code === 1) {
                this.axios.post('/user/logout')
                  .then(res => {
                    if (res.data.code === 1) {
                      localStorage.removeItem('userInfo')
                      this.$message.info('个人信息修改，请重新登录')
                      this.$router.push('/')
                    }
                  })
                  .catch(err => {
                    this.$message.error(err)
                  })
              }
            })
            .catch(err => {
              this.$message.error(err)
            })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getAllAc() {
      this.axios.get('/apartmentComplex')
        .then(res => {
          if (res.data.code === 1) {
            this.apartmentComplex = res.data.data
          }
        })
        .catch(err => {
          console.error(err);
        })
    },
    openChange() {
      this.userInfo.password = ''
      this.changePass = true
    }
  },
}
</script>

<style lang="less" scoped>
h3 {
  font-size: 30px;
  padding-left: 20px;
}

.form {
  width: 37%;
}
</style>