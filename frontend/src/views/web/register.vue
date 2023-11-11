<template>

  <div class="register-login">

    <span data-aos="fade-down" class="register-item" style="margin-top: 150px;">你好 世界!</span>

    <el-input class="register-item" maxlength="16" show-word-limit v-model="nickname" placeholder="请输入昵称" clearable />

    <el-input class="register-item" maxlength="16" show-word-limit v-model="username" placeholder="请输入账号" clearable />

    <el-input
      class="register-item"
      v-model="password"
      maxlength="32"
      show-word-limit
      type="password"
      placeholder="请输入密码"
      show-password
    />
    <div class="register-button">
      <el-button data-aos="fade-right" class="register-item" style="width: 40%;" @click="back">返回</el-button>

      <el-button data-aos="fade-left" class="register-item" style="width: 40%;" @click="register">注册</el-button>
    </div>

    <div data-aos="zoom-in-up" class="register-item" style="margin-top: 350px;">
      你笑起来真好看
    </div>
    
  </div>

  
</template>


<script setup lang="ts">
  import { ref } from 'vue'
  import { userRegister } from '@/api/user'
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus'

  const router = useRouter();

  const nickname = ref('')
  const username = ref('')
  const password = ref('')

  const register = () => {
    if (nickname.value == '' || nickname.value.length > 16) {
      ElMessage.warning('请输入正确格式的昵称')
      return
    }
    if (username.value == '' || username.value.length > 16) {
      ElMessage.warning('请输入正确格式的账号')
      return
    }

    if (password.value == '' || password.value.length > 32) {
      ElMessage.warning('请输入正确格式的密码')
      return
    }

    userRegister(
      nickname.value,
      username.value,
      password.value
    ).then(res => {
      if (res.data.data == true) {
        ElMessage.info('注册成功')
        router.push({path: '/login'})
      } else {
        ElMessage.warning(res.data.msg)
      }
    })

  }

  const back = () => {
    router.push({path: '/login'})
  }

</script>


<style scoped>
.register-login{
  display: flex;
  flex-direction: column;
  background-color: #f3f7fb; 
  width: 100%px;
  /* height: 309px; */
  min-height: 1000px;
  
  margin: 0 auto;
  align-items: center;
}
.register-item {
  text-align: center;
  width: 250px;
  margin-top: 40px;
  color: #909399;
}

.register-button {
  text-align: center;
}
</style>