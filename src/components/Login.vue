<template>
  <div class="loginContainer">
    <a-row>
      <a-col :span="12" class="leftContainer">
        <div style="width: 850px;height: 850px;background-color:#3491F0;border-radius: 0 0  850px 0;position: fixed">
          <img src="../assets/login_bg.svg" style="width: 600px;position: absolute;bottom: 150px;left: 50px">
        </div>
      </a-col>
      <a-col :span="5" class="rightContainer" :offset="3">
        <a-form-model style="margin-top: 300px" :model="loginForm" ref="loginForm" :rules="formRules">
          <a-form-model-item prop="username">
            <a-input placeholder="Username" size="large" id="usernameInput" v-model="loginForm.username">
              <a-icon slot="prefix" type="user" style="color:#ACACAC"/>
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input type="password" placeholder="Password" size="large" id="passwordInput"
                     v-model="loginForm.password">
              <a-icon slot="prefix" type="lock" style="color:#ACACAC"/>
            </a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" style="width: 90px ;border-radius: 40px;font-weight: bold"
                      @click="submitLoginForm">登录
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {},
      formRules: {
        username: [
          {required: true, message: '用户名不可以为空', trigger: 'blur'},
          {validator: this.checkUsername, trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可以为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitLoginForm() {
      this.$refs.loginForm.validate().then(r => {
        this.$http.post("/user/login", this.loginForm).then(response => {
          if (response.data.status === 2000) {
            localStorage.setItem('air-sensor-token', response.data.data.token)
            this.$router.push({path: '/'})
          } else if (response.data.status === 4006) {
            this.$message.error('用户名或密码错误')
            this.loginForm = {}
          } else {
            this.$message.error('登录出错联系管理员')
          }
        }, e => {

        })
      }, error => {

      })

    },
    checkUsername(rule, value, callback) {
      let pattern = /^[a-zA-Z0-9_-]{5,15}$/
      if (pattern.test(value)) {
        callback();
      } else {
        callback(new Error('用户名由字母数字下划线组成，长度为为5到15'));
      }
    }
  }
}
</script>

<style scoped>
.loginContainer .leftContainer {

}


</style>
