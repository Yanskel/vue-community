<template>
  <div class="main">
    <el-form label-width="100px" class="login_container" :model="form" inline>
      <h3 class="login_title">管理员登陆</h3>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password @keyup.enter.native="login">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="login">
          <span v-if="!loading">登录</span>
          <span v-else>登录中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    login() {
      this.loading = true
      this.axios.post('/admin/login', this.form)
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success('管理员登录成功')
            localStorage.setItem('userInfo', JSON.stringify(res.data.data.admin))
            //删除菜单里空的children元素
            let menus = res.data.data.menu
            for (let menu of menus) {
              if (menu.children.length === 0) {
                delete menu.children
              }
            }
            this.$store.commit('SET_MENU', menus)
            this.$router.replace('/main')
          } else {
            this.$message.error(res.data.msg);
            this.loading = false
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
.main {
  height: 100vh;
  width: 100vw;
}

.login_container {
  width: 350px;
  border: 1px solid #eaeaea;
  position: relative;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 0 25px #cac6c6;
  box-sizing: border-box;

  .login_title {
    text-align: center;
    margin-bottom: 40px;
    color: #7b7474;
  }

  .el-input {
    width: 198px;
  }

  .el-button {
    margin-left: 140px;
  }
}
</style>