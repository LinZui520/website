<template>
  <div class="markdown">
    <MdEditor  v-model="content" />
    <MdPreview :modelValue="content" />
    <!-- <MdCatalog :editorId="id" :scrollElement="scrollElement" /> -->
  </div>
  
</template>


<script setup lang="ts">
  import useArticleStore from '@/store/article';
  import { ref } from 'vue';
  import { MdPreview, MdCatalog } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';

  const articleStore = useArticleStore()
  const content = ref(articleStore.content)
  // const scrollElement = document.documentElement;
</script>


<style scoped>
.markdown {
  display: flex;
  flex-direction: row;
  margin-left: 15%;
  margin-right: 15%;
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>