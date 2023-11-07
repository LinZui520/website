<template>
  <el-tabs v-model="activeName" class="tabs" >
    <el-tab-pane class="pane" label="增加文章" name="add">
      <AddArticle></AddArticle>
    </el-tab-pane>

    <el-tab-pane class="pane" label="删除文章" name="delete">
      <DeleteArticle></DeleteArticle>
    </el-tab-pane>

    <el-tab-pane class="pane" label="修改文章" name="update">
      Role
    </el-tab-pane>
  </el-tabs>
</template>


<script setup lang="ts">
  import { ref } from 'vue'
  import AddArticle from '@/components/admin/AddArticle.vue'
  import DeleteArticle from '@/components/admin/DeleteArticle.vue';


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