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
</template>

<style>
* {
  font-family: "ComicSansMS","YouSheYuFeiTeJianKangTi";
  margin: 0px;
  padding: 0px;
}
</style>
