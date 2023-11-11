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
</template>

<style>
* {
  font-family: "ComicSansMS","YouSheYuFeiTeJianKangTi";
  margin: 0px;
  padding: 0px;
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
