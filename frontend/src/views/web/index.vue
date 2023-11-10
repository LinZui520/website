<template>

  <div class="common-layout home-view">

    <el-container>

      <el-header class="home-header" data-aos="fade-down">
        <el-row :gutter="20">
          <el-col :span="9" class="header-item">
            <el-link href="/" type="info" :underline="false">首页</el-link>
            <el-link href="/about" type="info" :underline="false">关于</el-link>
          </el-col>
          <el-col :span="9" class="header-item">
          </el-col>
          <el-col :span="6" class="header-item">
            <el-link v-if="!isLogin" href="/login" type="info" :underline="false">登录</el-link>
            <el-link v-else href="/login" type="info" :underline="false">{{ nickname }}</el-link>
          </el-col>
        </el-row>
        
      </el-header>

      <router-view></router-view>
  

      <el-footer class="home-footer">
        <div class="footer-left">
          <span style="color: rgb(79, 79, 79);">你好 世界</span>
        </div>
        <div class="footer-right">
          <span style="color: rgb(79, 79, 79);">
            Copyright ©2023 Yangming He
          </span>
        </div>
      </el-footer>
    </el-container>
  </div>
  
</template>


<script setup lang="ts">
  import { ref } from 'vue';
  import useUserStore from '@/store/user';

  const userStore = useUserStore()

  const isLogin = ref(false)
  const nickname = ref('User')

  if (userStore.isLogin == true) {
    isLogin.value = userStore.isLogin
    nickname.value = userStore.nickname
  }
</script>


<style scoped>
.home-view {
  background-color: #f3f7fb;
}
.home-header {
  background-color: white;
  height: 60px;
  .header-item{
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 18px;
    
    .el-link {
      font-size: large;
      margin-right: 5%;
      margin-left: 5%;
    }
  }
}

.home-footer {
  background-color: white;
  height: 100px;
  padding: 1%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .footer-left{
    display: flex;
    align-items: center;
    padding-left: 10%;
  }
  .footer-right{
    display: flex;
    align-items: center;
    padding-right: 10%;
  }
}
</style>