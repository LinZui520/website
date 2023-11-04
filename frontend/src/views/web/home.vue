<template>
  <div class="home-view">
    
  
    <div class="home-nav">
      
      <div class="left">
        <span>你好 世界</span>
        <span>简单 无样式</span>
      </div>
      <div class="center">
        <el-link :underline="false" href="/" style="margin-right: 20px;">
          <span style="font-size: large;">首页</span>
        </el-link>
        <el-link :underline="false" href="/about" style="margin-right: 20px;">
          <span style="font-size: large;">关于</span>
        </el-link>
      </div>
      <div class="right">
        <el-link :underline="false" href="/admin/login" style="margin-right: 20px;">
          <span style="font-size: large;">登陆</span>
        </el-link>
      </div>
    
    </div>
  

    <div class="home-banner">
      <carousel></carousel>
    </div>
    

    <div class="home-constainer">
      <h1 class="home-item">ni</h1>
      <h1 class="home-item">ni</h1>
      <h1 class="home-item">ni</h1>
      <h1 class="home-item">ni</h1>
    </div>

    <div class="home-footer">

    </div>


  </div>
</template>


<script setup lang="ts">
  import carousel from '@/components/web/carousel.vue'
  

</script>


<style scoped>
.home-nav {
  background-color: white;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* box-shadow: 1px 1px 10px black; */
  /* border-radius: 10px 10px 0px 0px; */
  
  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 20%;
  }
  .center {
    display: flex;
    justify-content: center;
    width: 60%;

  }
  .right {
    display: flex;
    justify-content: center;
    width: 20%;
  }
}


.home-constainer {
  background-color: #f0eeee ;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 10px black;
  border-radius: 0px 0px 10px 10px;
}

.home-item {
  border: 2px solid white;
  background-color: white;
  border-radius: 5px;
  margin: 10px 10px 10px 10px;
  height: 316px;
  width: 61%;

  transition: all 0.3s ease 0s;
}
.home-item:hover {
  border: 2px solid white;
  background-color: white;
  border-radius: 5px;
  margin: 10px 10px 10px 10px;
  height: 316px;
  width: 61%;

  transform: scale(1.1);
  transition: all 0.3s ease 0s;
  -webkit-transform: scale(1.1);
}

.home-view {
  background-color: white;
  width: 100%;
}


.el-link {
  margin-right: 8px;
}
.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
</style>