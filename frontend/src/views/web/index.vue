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
            <el-link v-if="!userStore.isLogin" href="/login" type="info" :underline="false">登录</el-link>
            <el-link v-else type="info" :underline="false" @click="userInfo">{{ userStore.nickname }}</el-link>
          </el-col>
        </el-row>
        
      </el-header>

      <router-view></router-view>
  
    </el-container>
  </div>
  
</template>


<script setup lang="ts">
  import useUserStore from '@/store/user';
  import { useRouter } from 'vue-router';

  const userStore = useUserStore()
  const router = useRouter()


  const userInfo = () => {
    router.push({name: 'info', params: {username: userStore.username}})
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
</style>