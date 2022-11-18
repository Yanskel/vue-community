<template>
  <div class="login-register">
    <div class="admin">
      <el-link icon="el-icon-s-custom" @click="toAdmin">管理员登录</el-link>
    </div>
    <div class="contain">
      <div class="big-box" :class="{ active: isLogin }">
        <div class="big-contain" key="bigContainLogin" v-if="isLogin">
          <div class="btitle">账户登录</div>
          <div class="bform">
            <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
            <el-input placeholder="请输入密码" v-model="form.password" show-password @keyup.enter.native="login"></el-input>
          </div>
          <el-button :loading="loading" class="bbutton" @click="login">
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </el-button>
        </div>
        <div class="big-contain" key="bigContainRegister" v-else>
          <div class="btitle">创建账户</div>
          <div class="bform">
            <el-input size="medium" placeholder="请输入用户名" v-model="form.username" @blur="checkUsername"></el-input>
            <span class="errTips" v-if="existed">* 用户名已经存在 *</span>
            <span class="errTips" v-if="isEmpty">* 用户名不能为空 *</span>
            <el-input size="medium" placeholder="请输入密码" v-model="form.password" show-password @blur="checkPwd">
            </el-input>
            <span class="errTips" v-if="rightPwd">* 密码长度应为8-16位 *</span>
            <el-input size="medium" placeholder="请输入手机号" v-model="form.phone" @blur="checkPhone"></el-input>
            <span class="errTips" v-if="correctPhone">* 请输入正确的手机号 *</span>
          </div>
          <el-button type="info" class="bbutton" @click="register" :disabled="ban">注 册</el-button>
        </div>
      </div>
      <div class="small-box" :class="{ active: isLogin }">
        <div class="small-contain" key="smallContainRegister" v-if="isLogin">
          <div class="stitle">社区疫情防控系统</div>
          <p class="scontent">还没有账号？快点注册吧！</p>
          <button class="sbutton" @click="changeType">注 册</button>
        </div>
        <div class="small-contain" key="smallContainLogin" v-else>
          <div class="stitle">欢迎回来!</div>
          <p class="scontent">与我们保持联系，请登录你的账户</p>
          <button class="sbutton" @click="changeType">登 录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LoginRegister',
  data() {
    return {
      isLogin: true, //登录，注册切换
      existed: false,//用户名存在判断
      isEmpty: false,//判断用户名是否为空 
      rightPwd: false, //判断密码
      correctPhone: false, //判断手机号
      form: {  // 登录与注册信息
        username: '',
        password: '',
        phone: ''
      },
      loading: false, //登录转圈
      ban: true //注册可用状态
    }
  },
  computed: {
    ...mapState(['userForm']),
  },
  methods: {
    //注册、登录切换
    changeType() {
      this.isLogin = !this.isLogin
      this.form.username = ''
      this.form.password = ''
      this.form.phone = ''
      this.existed = false
      this.rightPwd = false
      this.correctPhone = false
      this.isEmpty = false
    },
    //注册条件通过判断
    allowRegister() {
      if (this.existed === false && this.isEmpty === false && this.rightPwd === false && this.correctPhone === false) {
        this.ban = false
      } else {
        this.ban = true
      }
    },
    //登录
    login() {
      this.loading = true
      this.axios.post('/user/login', this.form)
        .then(res => {
          if (res.data.code === 1) {
            this.$store.commit('ADD_LOGIN', res.data.data)
            if (res.data.data.role === 0 && res.data.data.idNumber == null) {
              this.$message.info('请先完善个人信息');
              this.$router.replace('/complete')
            } else {
              this.$message.success('登录成功');
              localStorage.setItem('userInfo', JSON.stringify(res.data.data))
              this.$router.replace('/main')
            }
          } else {
            this.$message.error(res.data.msg);
            this.loading = false
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
    },
    //注册
    register() {
      this.axios.post('/user/register', this.form)
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.data);
            this.changeType()
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
    },
    //判断用户名格式
    checkUsername() {
      if (this.form.username === null || this.form.username === '') {
        this.existed = false
        this.isEmpty = true
      } else {
        this.axios.get('/user/check?username=' + this.form.username)
          .then(res => {
            if (res.data.code === 0) {
              this.existed = true
              this.isEmpty = false
            } else {
              this.existed = false
              this.isEmpty = false
            }
          })
          .catch(err => {
            this.$message.error(err);
          })
      }
      this.allowRegister()
    },
    //判断密码格式
    checkPwd() {
      const reg = /^\w{8,16}$/
      const flag = reg.test(this.form.password)
      if (flag) {
        this.rightPwd = false
      } else {
        this.rightPwd = true
      }
      this.allowRegister()
    },
    //判断手机号格式
    checkPhone() {
      const reg = /^1\d{10}$/
      const flag = reg.test(this.form.phone)
      if (flag) {
        this.correctPhone = false
      } else {
        this.correctPhone = true
      }
      this.allowRegister()
    },
    //前往管理员登录页面
    toAdmin(){
      this.$router.push('/adminLogin')
    }
  }
}
</script>

<style lang="less" scoped>
.admin {
  float: right;
  padding: 10px 20px 0 0;

  .el-link {
    color: rgb(57, 167, 176);
  }
}

.login-register {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}

.contain {
  width: 60%;
  height: 60%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 25px #cac6c6,
    0 0 6px #f0f0f0;
}

.big-box {
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
}

.big-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btitle {
  font-size: 1.5em;
  font-weight: bold;
  color: rgb(57, 167, 176);
}

.bform {
  width: 100%;
  height: 40%;
  padding: 2em 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.bform .errTips {
  display: block;
  width: 45%;
  text-align: left;
  color: red;
  font-size: 0.7em;
  margin-left: 1em;
}

.bform .el-input {
  width: 50%;
  height: 30px;
  border: none;
  outline: none;
  padding-left: 2em;
}

.bbutton {
  width: 20%;
  height: 40px;
  border-radius: 24px;
  border: none;
  outline: none;
  background-color: rgb(57, 167, 176);
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}

.small-box {
  width: 30%;
  height: 100%;
  background: linear-gradient(135deg, rgb(57, 167, 176), rgb(56, 183, 145));
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  transition: all 1s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.small-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stitle {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
}

.scontent {
  font-size: 0.8em;
  color: #fff;
  text-align: center;
  padding: 2em 4em;
  line-height: 1.7em;
}

.sbutton {
  width: 60%;
  height: 40px;
  border-radius: 24px;
  border: 1px solid #fff;
  outline: none;
  background-color: transparent;
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}

.big-box.active {
  left: 0;
  transition: all 0.5s;
}

.small-box.active {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);
  transition: all 1s;
}
</style>
