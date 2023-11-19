<template>
  <div class="baberrage">
    <vue-danmaku 
      class="danmaku"
      v-model:danmus="refComments"
      loop
      useSlot
      :randomChannel="true"
      :speeds="88"
      :fontSize="25"
      :debounce="2000"
      :isSuspend="true"
    >
      <template v-slot:dm="{ danmu }">
        <span style="color: #909399;">{{ danmu.nickname }}：{{ danmu.content }}</span>
      </template>
    </vue-danmaku>

    <div class="comment">
      <el-input
        v-model="content"
        type="text"
        placeholder="请输入留言"
        class="comment-item"
      />
      <el-button class="comment-item" style="max-width: 20%;" @click="send">发送</el-button>
    </div>
  </div>
</template>


<script setup lang="ts">
  import vueDanmaku from 'vue3-danmaku'
  import { ref } from 'vue'
  import { addComment, getAllComment } from '@/api/comment'
  import { getUser } from '@/api/user'
  import useUserStore from '@/store/user';
  import { ElMessage } from 'element-plus'


  type Comment = {
    id: number
    commenter: number
    nickname: string
    content: string
  };
  let comments: Comment[] = []
  const refComments = ref(comments)
  const update = async () => {
    try {
      refComments.value = (await getAllComment()).data.data
      refComments.value.forEach((value) => {
        getUser(value.commenter).then(res => {
          value.nickname = res.data.data.nickname
        })
      })
      refComments.value.sort(() => Math.random() - 0.5);
    } catch(err) {
      ElMessage.warning("怎么回事 获取留言列表失败")
    }
  }
 

  update()

  const userStore = useUserStore()
 
  const content = ref('')

  const send = () => {
    if (content.value == '') {
      ElMessage.warning('是不是忘记写留言了？')
      return
    }
    if (userStore.isLogin == false) {
      ElMessage.warning('帅哥美女请先登录哇')
      return
    }

    addComment(userStore.id, content.value).then(res => {
      if (res.data.code == 200) {
        ElMessage.success('留言成功')
        content.value = ""
        update()
      } else {
        ElMessage.warning('不知道怎么回事，留言失败了')
      }
    }).catch(err => {
      ElMessage.warning('不知道怎么回事，留言失败了')
    })
  }

</script>


<style scoped>

.baberrage {
  width: 100%;
  height: 500px;
  background: white;
  .danmaku {
    width: 100%;
    height: 100%;
  }

  .comment {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
  }
  .comment-item {
    width: 50%;
    margin-top: 20px;
  }
  
  /* border-radius: 15px 15px 15px 15px; */
}


</style>