<template>

  <div class="admin-login">

    <span class="admin-item">Hello World!</span>

    <el-input class="admin-item" v-model="username" placeholder="Please input username" clearable />

    <el-input
      class="admin-item"
      v-model="password"
      type="password"
      placeholder="Please input password"
      show-password
    />
    <el-button class="admin-item" style="width: 30%;" @click="login">login</el-button>
  </div>

  
</template>


<script setup lang="ts">
  import { ref } from 'vue'
  import { userLogin } from '@/api/user'
  import { useRouter } from 'vue-router';
  import useUserStore from '@/store/user'

  const router = useRouter();
  const userStore = useUserStore();

  const username = ref('')
  const password = ref('')

  const login = () => {
    userLogin(
      username.value,
      password.value
    ).then(res => {
      if (res.data.data == true) {
        userStore.isLogin = true
        userStore.username = username.value
        router.push({path: '/admin'})
      } else {
        console.log('登陆失败')
      }
    }).catch(err => {
      console.log('网络原因,登陆失败', err)
    })
  }
</script>


<style scoped>
.admin-login{
  display: flex;
  flex-direction: column;
  
  width: 500px;
  height: 309px;

  
  margin: 0 auto;
  margin-top: 50px;
  align-items: center;
  justify-content: center;
}
.admin-item {
  text-align: center;
  width: 50%;
  margin-top: 40px;
}
</style>