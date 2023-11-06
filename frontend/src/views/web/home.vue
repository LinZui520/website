<template>

  <el-container class="home-main">
    <el-main class="home-article" >
      <articles></articles>
    </el-main>
    <el-aside class="home-aside" style="background-color: aquamarine;">aside</el-aside>
  </el-container>
  
  <div style="height: 800px;">

  </div>
  
</template>


<script setup lang="ts">
  import articles from '@/components/articles.vue';
  

</script>


<style scoped>

.home-main {
  /* background-color: white; */
  /* height: 1200px; */

  margin: 10px;
  margin-left: 15%;
  margin-right: 15%;
}
.home-article {
  margin-right: 2%;
}
.home-aside {
  margin-left: 2%;
}

</style>