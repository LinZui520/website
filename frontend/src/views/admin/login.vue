<template>

  <div class="admin-login">

    <span data-aos="fade-down" class="admin-item">你好 世界!</span>

    <el-input class="admin-item" v-model="username" placeholder="请输入账号" clearable />

    <el-input
      class="admin-item"
      v-model="password"
      type="password"
      placeholder="请输入密码"
      show-password
    />
    <div class="admin-button">
      <el-button data-aos="fade-right" class="admin-item" style="width: 40%;" @click="back">返回</el-button>

      <el-button data-aos="fade-left" class="admin-item" style="width: 40%;" @click="login">登录</el-button>
    </div>
    
  </div>

  
</template>


<script setup lang="ts">
  import { ref } from 'vue'
  import { userLogin } from '@/api/user'
  import { useRouter } from 'vue-router';
  import useUserStore from '@/store/user'
  import { ElMessage } from 'element-plus'

  import { useCookies } from "vue3-cookies";
  const { cookies } = useCookies();
  const router = useRouter();
  const userStore = useUserStore();

  const username = ref('')
  const password = ref('')

  const login = () => {
    if (username.value == '') {
      ElMessage.warning('请输入账号')
      return
    }

    if (password.value == '') {
      ElMessage.warning('请输入密码')
      return
    }

    userLogin(
      username.value,
      password.value
    ).then(res => {
      if (res.data.data != "") {
        userStore.isLogin = true
        userStore.username = username.value
        cookies.set('token', res.data.data, '1m')
        ElMessage.success('登陆成功')
        router.push({path: '/admin'})
      } else {
        ElMessage.warning('账号或密码错误')
      }
    }).catch(err => {
      ElMessage.error('网络错误 登陆失败')
    })
  }

  const back = () => {
    router.push({path: '/'})
  }
  userLogin(cookies.get('username'), cookies.get('password')).then(res => {
    if (res.data.data == true) {
      userStore.isLogin = true
      userStore.username = cookies.get('username')
      router.push({path: '/admin'})
    }
  })
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
  color: #909399;
}

.admin-button {
  text-align: center;
}
</style>