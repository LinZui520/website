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
    <div class="admin-button">
      <el-button class="admin-item" style="width: 40%;" @click="back">back</el-button>

      <el-button class="admin-item" style="width: 40%;" @click="login">login</el-button>
    </div>
    
  </div>

  
</template>


<script setup lang="ts">
  import { ref } from 'vue'
  import { userLogin } from '@/api/user'
  import { useRouter } from 'vue-router';
  import useUserStore from '@/store/user'
  import { ElMessage } from 'element-plus'

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
        ElMessage.success('Login successful')
        router.push({path: '/admin'})
      } else {
        ElMessage.warning('Incorrect account or password')
      }
    }).catch(err => {
      ElMessage.error('Network reasons, login failed')
    })
  }

  const back = () => {
    router.push({path: '/'})
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

.admin-button {
  text-align: center;
}
</style>