<template>

  <div class="articles" v-for="item in refArticles">
    <div class="article" data-aos="zoom-in-up" @click="read(item.id)">

      <img class="article-image" :src="item.imageURL">

      <div class="article-title">
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>

    
</template>


<script setup lang="ts">
  import { getAllArticle } from '@/api/article';
  import { getImage } from '@/api/image';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus'


  type Article = {
    id: number
    title: string
    image: number
    content: string
    imageURL: string
  };
  let articles: Article[] = []

  const refArticles = ref(articles)

  const update = async () => {
    try {
      refArticles.value = (await getAllArticle()).data.data
      refArticles.value.forEach((value) => {
        getImage(value.image).then(res => {
          value.imageURL = res.data.data.url
        })
      })
    } catch(err) {
      ElMessage.warning("怎么回事 获取文章列表失败")
    }
  }
 
  

  update()

  const router = useRouter()

  const read = (id: number) => {
    router.push({name: 'article', params: {id: id}})
  }
  

</script>


<style scoped>

.articles {
  margin-left: 15%;
  margin-right: 15%;
}
.article {
  height: 300px;
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  transition: all 0.3s;
  box-shadow: #909399;
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
  object-fit: contain;
}

.article-title {
  background-color: rgb(255, 255, 255);
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 0px 10px 10px 0px;
  color: #909399;
}
span {
  align-self: center;
}
</style>