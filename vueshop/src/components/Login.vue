<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar">
        <img src="../assets/e.jpg" alt="">
      </div>
      <el-form :model="loginForm" class="login_form" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    reset() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        let {data: res} = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang='less' scoped>
  .login-container {
    background: url(../assets/bg.jpg);
    background-size: cover;
    height: 100%;
  }
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    transform: translate(-50%, -50%);
    .avatar{
      overflow: hidden;
      position: absolute;
      left: 50%;
      width: 130px;
      height: 130px;
      padding: 10px;
      border: 1px solid #eee;
      background-color: #fff;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
    }
    .login_form{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btn{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>