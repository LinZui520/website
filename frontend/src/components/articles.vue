<template>
  <div v-for="item in reactiveItems.data">
    <div class="article" data-aos="zoom-in-up" @click="read(item.article.id)">

      <img class="article-image" :src="item.image">

      <div class="article-title">
        <span>{{ item.article.title }}</span>
      </div>
    </div>


    
  </div>
</template>


<script setup lang="ts">
  import { getAllArticle, getSpecifiedImage, getOneArticle } from '@/api/article';
  import { reactive } from 'vue';
  import useArticleStore from "@/store/article";
  import { useRouter } from 'vue-router';

  const ip = "http://127.0.0.1:8080/image/"

  type Article = {
    id: number
    title: string
    content: string
  };
  let articles: Article[] = []


  type Image = {
    id: number
    name: string
    belong: number
  }

  type Show = {
    article: Article
    image: string
  }
  let items: Show[] = []
  const reactiveItems = reactive({data: items})
  

  const update = async () => {
    try {
      articles = (await getAllArticle()).data.data
      var article: any
      articles.forEach((article) => {
        getSpecifiedImage(article.id).then(res => {
          console.log(article)
          console.log(res.data.data[0].name)
          reactiveItems.data.push({
            article: article,
            image: ip + res.data.data[0].name
          })
        }).catch(err => {

        })
      })
    } catch(err) {

    }
  }
 
  update()

  const articleStore = useArticleStore()
  const router = useRouter()

  const read = (id: number) => {
    getOneArticle(id).then(res => {
      articleStore.id = res.data.data.id
      articleStore.title = res.data.data.title
      articleStore.content = res.data.data.content
    }).catch(err => {

    })
    router.push({path: '/article'})
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
  background-color: #f3f7fb;
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
  border-radius: 0px 10px 10px 0px;

  
}
span {
  margin-top: 50px;
  margin-left: 30px;
  margin-right: 30px;
}
</style>