<template>
  <div class="container-fluid bg-light">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-lg-12">
        <div class="card-container">
          <div class="card shadow-lg">
            <div class="card-body p-5">
              <h3 class="text-center mb-4">欢迎来到 Vue 学校管理系统</h3>
              <div class="row">
                <div class="col-md-6">
                  <router-link to="/login" class="btn btn-primary btn-lg mb-3">登录</router-link>
                  <router-link to="/register" class="btn btn-secondary btn-lg mb-3">注册</router-link>
                </div>
                <div class="col-md-6 d-flex justify-content-center align-items-center" style="overflow: hidden !important; border: 1px solid #ccc; border-radius: 10px;padding: 0px;">
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
export default {
  data() {
    return {
      url: '3d/scene.splinecode',
    };
  },
};
</script>

<style>
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
</style>