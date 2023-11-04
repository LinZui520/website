<template>

  <div class="common-layout home-view">

    <el-container>

      <el-header class="home-header">
        Header
      </el-header>

      <el-container>
        <el-main class="home-main">Main</el-main>

        <el-aside width="200px" class="home-aside">Aside</el-aside>
      </el-container>

      <el-footer class="home-footer">Footer</el-footer>
    </el-container>
  </div>
  
</template>


<script setup lang="ts">
  import carousel from '@/components/web/carousel.vue'
  

</script>


<style scoped>
.home-view {
  background-color: #f3f7fb;
}
.home-header {
  background-color: white;
}
.home-aside {
  background-color: white;


  border: 1px solid rgb(224, 224, 224);
  border-radius: 10px;
  margin: 10px;
}
.home-main {
  background-color: white;
  height: 600px;

  border: 1px solid rgb(224, 224, 224);
  border-radius: 10px;

  margin: 10px;
}
.home-footer {
  background-color: white;
  height: 100px;
}
</style>