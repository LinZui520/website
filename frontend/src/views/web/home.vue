<template>

  <el-container class="home-main">
    <el-main class="home-article" >
      <articles></articles>
    </el-main>
  </el-container>
  
  
</template>


<script setup lang="ts">
  import articles from '@/components/web/articles.vue';
  

</script>


<style scoped>

.home-main {

  margin: 10px;
  margin-left: 15%;
  margin-right: 15%;
}
.home-article {
  width: 100%;
  min-height: 800px;
}

</style>