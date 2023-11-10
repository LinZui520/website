<template>

  <div class="admin-login">

    <span data-aos="fade-down" class="admin-item">你好 世界!</span>

    <el-input class="admin-item" v-model="nickname" placeholder="请输入昵称" clearable />

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

      <el-button data-aos="fade-left" class="admin-item" style="width: 40%;" @click="register">注册</el-button>
    </div>
    
  </div>

  
</template>


<script setup lang="ts">
  import { ref } from 'vue'
  import { userLogin, userRegister } from '@/api/user'
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus'

  const router = useRouter();

  const nickname = ref('')
  const username = ref('')
  const password = ref('')

  const register = () => {
    if (nickname.value == '') {
      ElMessage.warning('请输入昵称')
      return
    }
    if (username.value == '') {
      ElMessage.warning('请输入账号')
      return
    }

    if (password.value == '') {
      ElMessage.warning('请输入密码')
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
.admin-login{
  display: flex;
  flex-direction: column;
  
  width: 500px;
  /* height: 309px; */

  
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