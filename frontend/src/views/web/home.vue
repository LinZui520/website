<template>
  <div class="home-view">

    <div class="home-nav">
      <div class="home-container">
        <div class="left">
          <span>HYM</span>
        </div>
        <div class="center">
          <span><a href="/">首页</a></span>
          <span><a href="/about">关于</a></span>
        </div>
        <div class="right">
          <span>搜索</span>
        </div>
      </div>
    </div>
    
    <div class="home-banner" style="width: 100%;">
      <carousel></carousel>
    </div>
    

    <div class="home-container">

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
  box-shadow: 1px 1px 5px #0003;
  display: flex;
  justify-content: center;
  .left {
    display: flex;
    justify-content: center;
    width: 20%;
  }
  .center {
    display: flex;
    justify-content: center;
    width: 60%;

    a {
      color: white;

      &:hover {
        color: var(--active);
      }
    }
  
  }
  .right {
    display: flex;
    justify-content: center;
    width: 20%;
  }
}

.home-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home-view {
  background-color: #f0eeee;
}
</style>