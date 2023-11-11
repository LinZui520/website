<template>
  <div style="height: 1000px;background-color: #f3f7fb;">
    <el-tabs v-model="activeName" class="tabs" >
    <el-tab-pane class="pane" label="增加文章" name="add">
      <AddArticle></AddArticle>
    </el-tab-pane>

    <el-tab-pane class="pane" label="更新文章" name="delete">
      <UpdateArticle></UpdateArticle>
    </el-tab-pane>
  </el-tabs>
  </div>
  
</template>


<script setup lang="ts">
  import { ref } from 'vue'
  import AddArticle from '@/components/admin/AddArticle.vue'
  import UpdateArticle from '@/components/admin/UpdateArticle.vue';

  const activeName = ref('add')

</script>


<style scoped>
.tabs {
  padding: 32px;
  color: #6b778c;
}
.pane {
  font-size: large;
}
</style>