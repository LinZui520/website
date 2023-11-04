<template>
  <el-carousel indicator-position="none" height="512px">
    <el-carousel-item v-for="item in imgUrl" :key="item">
      <!-- <img :src="item" /> -->
      <el-image style="height: 512px" :src="item" :fit="fit" />
    </el-carousel-item>
  </el-carousel>
</template>


<script setup lang="ts">
  import image1 from "@/assets/images/1.jpg"
  import image2 from "@/assets/images/2.jpg"
  const imgUrl = [image1, image2]
</script>


<style scoped>

</style>