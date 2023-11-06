<template>
  <div class="markdown" v-html="markdown"></div>
</template>


<script setup lang="ts">
  import useArticleStore from '@/store/article';
  import MarkdownIt from 'markdown-it';
  const md = new MarkdownIt()

  const articleStore = useArticleStore()
  const markdown = md.render(articleStore.content)
</script>


<style scoped>
.markdown {
  margin-left: 15%;
  margin-right: 15%;
  margin-top: 5%;
  /* text-align: center; */
}
</style>