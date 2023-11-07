<template>
  <div v-for="item in reactiveArticles.data">
    <div class="article" data-aos="zoom-in-up" @click="read(item.id)">

      <img class="article-image" :src="item.image">

      <div class="article-title">
        <span>{{ item.title }}</span>
      </div>
    </div>


    
  </div>
</template>


<script setup lang="ts">
  import { getAllArticle } from '@/api/article';
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus'

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
 
  update()

  const router = useRouter()

  const read = (id: number) => {
    router.push({name: 'article', params: {id: id}})
  }
  

</script>


<style scoped>
.article {
  height: 300px;
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: row;
  background-color: #f3f7fb;
  border-radius: 10px;
  transition: all 0.3s;
}

.article:hover {
  box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15);/* 鼠标悬浮时盒子出现的阴影 */
	transform: translate(0, -10px);/* 鼠标悬浮时盒子上移10px */
}

.article-image {
  background-color: white;
  border-radius: 10px 0px 0px 10px;
  width: 50%;
  height:100%;
  object-fit: cover;
}

.article-title {
  background-color: rgb(255, 255, 255);
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 0px 10px 10px 0px;
}
span {
  margin-top: 50px;
}
</style>