<script setup lang="ts">
  import AOS from 'aos'
  AOS.init()

  import useUserStore from '@/store/user';
  import { useCookies } from "vue3-cookies";
  import { userTokenLogin } from './api/user';
  const userStore = useUserStore()
  const { cookies } = useCookies();

  if (cookies.get("token") != "") {
    userTokenLogin().then(res => {
      if (res.data.code == 200) {
        userStore.id = res.data.data.id
        userStore.nickname = res.data.data.nickname
        userStore.username = res.data.data.username
        userStore.isLogin = true
      }
    })
  }

</script>

<template>
  <RouterView />

  
  <el-container>
    <el-footer class="home-footer">
    
      <el-link href="https://beian.miit.gov.cn/" type="info" :underline="false" target='_blank'>
        赣ICP备2023014673号
      </el-link>
   
      <span style="color: #909399;">
        Copyright ©2023 Yangming He
      </span>

    </el-footer>
  </el-container>
</template>

<style>
* {
  font-family: "LXGWWenKai-Bold";
  margin: 0px;
  padding: 0px;
}
.home-footer {
  background-color: white;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
