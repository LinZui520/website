<template>
  <el-table :data="reactiveArticles.data" style="width: 100%"> 
    <el-table-column class="delete-item" prop="id" label="文章编号" />
    <el-table-column class="delete-item" prop="title" label="文章标题" />
    <el-table-column class="delete-item"  label="操作">
      <template #default="scope">
        <el-button line size="small" @click.prevent="submitDelete(scope.row.id)"
          >删除</el-button>
          <el-button line size="small" @click.prevent="submitUpdate(scope.row.id)"
          >编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>


<script setup lang="ts">
  import { getAllArticle, deleteArticle } from '@/api/article';
  import { ElMessage } from 'element-plus'
  import { onMounted, reactive } from 'vue';

  type Article = {
    id: number
    title: string
    image: string
    content: string
  };
  let articles: Article[] = []


  const reactiveArticles = reactive({data: articles})


  const update = async () => {
    try {
      reactiveArticles.data = (await getAllArticle()).data.data
    } catch(err) {
      ElMessage.warning("获取文章列表失败")
    }
  }
 
  onMounted(() => {
    update()
  })
  

  const submitDelete = (id: number) => {
    deleteArticle(id).then(res => {
      update()
    }).catch(err => {
      ElMessage.warning("删除失败")
    })
  }

  const submitUpdate = (id: number) => {

  }

</script>


<style scoped>
.delete-item {
  width: 30%;
}
</style>