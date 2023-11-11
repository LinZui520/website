<template>

  <div class="login">

    <span data-aos="fade-down" class="login-item" style="margin-top: 150px;">你好 世界!</span>

    <el-input class="login-item" maxlength="16" show-word-limit v-model="username" placeholder="请输入账号" clearable />

    <el-input
      class="login-item"
      v-model="password"
      maxlength="32"
      show-word-limit
      type="password"
      placeholder="请输入密码"
      show-password
    />

    <el-link data-aos="fade-up" class="login-item" href="/register" type="info" :underline="false">
      New 一个 对象？
    </el-link>

    <div style="text-align: center;">
      <el-button data-aos="fade-right" class="login-item" style="width: 40%;" @click="back">返回</el-button>

      <el-button data-aos="fade-left" class="login-item" style="width: 40%;" @click="login">登录</el-button>
    </div>

    <div data-aos="zoom-in-up" class="login-item" style="margin-top: 350px;">
      你可以永远相信狗哥
    </div>
    
  </div>

  
</template>


<script setup lang="ts">
  import { ref } from 'vue'
  import { userLogin, userInfo } from '@/api/user'
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
    if (username.value == '' || username.value.length > 16) {
      ElMessage.warning('请输入正确格式的账号')
      return
    }

    if (password.value == '' || password.value.length > 32) {
      ElMessage.warning('请输入正确格式的密码')
      return
    }

    userLogin(
      username.value,
      password.value
    ).then(res => {
      if (res.data.code == 200) {
        cookies.set('token', res.data.data, '1m')
        ElMessage.success('登陆成功')
        userInfo(username.value).then(res => {
          userStore.id = res.data.data.id
          userStore.nickname = res.data.data.nickname
          userStore.username = res.data.data.username
          userStore.isLogin = true
        }).catch(err => {
          ElMessage.warning('获取个人信息失败')
        })

        router.push({path: '/'})
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

</script>


<style scoped>
.login{
  display: flex;
  flex-direction: column;
  
  background-color: #f3f7fb; 
  width: 100%;
  min-height: 1000px;

  
  margin: 0 auto;
  /* margin-top: 50px; */
  align-items: center;
}
.login-item {
  text-align: center;
  /* width: 20%; */
  width: 250px;
  margin-top: 40px;
  color: #909399;
}
</style>