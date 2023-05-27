<template>
  <div class="container-fluid bg-light">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-lg-12">
        <div class="card-container">
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <h3 class="text-center mb-4">用户登录</h3>
              <div class="row">
                <div class="col-md-6">
                  <form @submit.prevent="login">
                    <div class="form-floating mb-3">
                      <input type="text" class="form-control" v-model="username" placeholder="用户名" required />
                      <label for="username">用户名</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input type="password" class="form-control" v-model="password" placeholder="密码" required />
                      <label for="password">密码</label>
                    </div>
                    <div class="d-grid gap-2">
                      <button type="button" @click="login" class="btn btn-primary btn-lg">
                        登录
                      </button>
                    </div>
                  </form>
                </div>
                <div id="spline" class="col-md-6 d-flex justify-content-center align-items-center d-none d-md-block"
                  style="overflow: hidden !important; border: 1px solid #ccc; border-radius: 10px;padding: 0px;">
                  <spline-viewer class="spline-viewer" :url="url"></spline-viewer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//导入jquery
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: '',
      url: '3d/scene.splinecode'
    }
  },
  created: function () {
  },
  methods: {
    login() {


      axios.post('/login', {
        username: this.username,
        password: this.password
      }).then(response => {


          if (response.data.code === 200) {
            // 登录成功，根据用户信息类型进入不同的页面
            switch (response.data.data.userType) {

              case 'admin':
                // 1.将登录成功之后的 token，保存到客户端的 sessionStorage
                window.sessionStorage.setItem('user', response.data.data);
                this.$router.push('/admin/home')
                break
              case 'teacher':
                // 1.将登录成功之后的 token，保存到客户端的 sessionStorag
                window.sessionStorage.setItem('user', response.data.data)
                this.$router.push('/teacher/home')
                break
              case 'student':
                this.$router.push('/student/home')
                // 1.将登录成功之后的 token，保存到客户端的 sessionStorag
                window.sessionStorage.setItem('user', response.data.data)
               
                break
            }
          } else {
            alert(response.data.msg)
          }
        })
        .catch(error => {
          console.log(error)
          alert('登录失败，请稍后再试！')
        })
    }
  }
}
</script>

<style>
body {
  animation: color-change 10s infinite;
}

@keyframes color-change {
  0% {
    background-color: #ff0000;
  }

  50% {
    background-color: #00ff00;
  }

  100% {
    background-color: #0000ff;
  }
}

.card-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.card {
  width: 50%;
  margin: 20px;
}

.spline-viewer {
  height: 250px;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
