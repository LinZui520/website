<template>
  <div class="markdown">
    <MdPreview :modelValue="content" />
  </div>
</template>


<script setup lang="ts">
  import { ref } from 'vue';
  import { MdPreview } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { getOneArticle } from '@/api/article';
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const router = useRouter()
  const content = ref('')



  getOneArticle(Number(route.params.id)).then(res => {
    content.value = res.data.data.content
    if(res.data.data.content == undefined) {
      router.push({path: '/404'})
    }
  }).catch(err => {
    ElMessage.warning("获取文章失败")
  })

</script>


<style scoped>
.markdown {
  display: flex;
  flex-direction: row;
  margin-left: 15%;
  margin-right: 15%;
  margin-top: 50px;
  margin-bottom: 50px;
  min-height: 800px;
}
</style>