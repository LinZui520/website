<template>
  <div class="info" >
    <div data-aos="zoom-in-up" class="info-item">昵称：{{ userStore.nickname }}</div>
    <div data-aos="zoom-in-up" class="info-item">用户名：{{ userStore.username }}</div>
    <!-- <div style="text-align: center;">
      <el-button data-aos="fade-right" class="info-item" style="width: 40%;" @click="">更改昵称</el-button>

      <el-button data-aos="fade-left" class="info-item" style="width: 40%;" @click="">更改密码</el-button>
    </div> -->
    <div style="text-align: center;">
      <el-button data-aos="fade-right"  class="info-item" style="width: 40%;" @click="router.push({path: '/'})">
        返回主页
      </el-button>

      <el-button data-aos="fade-left"  class="info-item" style="width: 40%;" @click="SignOut">
        退出登录
      </el-button>
    </div>
  </div>
</template>


<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { userInfo } from '@/api/user'
  import { ElMessage } from 'element-plus'
  import useUserStore from '@/store/user';
  import { useCookies } from "vue3-cookies";

  const { cookies } = useCookies();
  const userStore = useUserStore()
  const route = useRoute()
  const router = useRouter()

  userInfo(String(route.params.username)).then(res => {
    if (res.data.code == 200) {

    } else {
      router.push({path: '/404'})
    }
  }).catch(err => {
    ElMessage.warning("获取个人信息失败")
    router.push({path: '/'})
  })

  const SignOut = () => {
    cookies.set('token', '')
    userStore.id = 0
    userStore.nickname = ''
    userStore.username = ''
    userStore.isLogin = false
    router.push({path: '/'})
  }


</script>


<style scoped>
.info {
  display: flex;
  flex-direction: column;

  background-color: #f3f7fb; 
  width: 100%;
  min-height: 1000px;

   
  /* margin: 0 auto; */
  align-items: center;
}

.info-item {
  text-align: center;
  width: 50%;
  margin-top: 88px;
  color: #909399;
}
</style>