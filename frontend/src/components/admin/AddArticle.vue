<template>
  <div>
    <MdEditor class="markdown" v-model="content" />
    <div class="upload">
   
      <input  class="upload-button" type="file" @change="handleFileChange" />
   
    
      <el-input class="upload-button upload-input" v-model="title" placeholder="请输入标题" />
    
      <el-button class="upload-button"  @click="submit">提交</el-button>
  
      
    </div>
  </div>
  
  
</template>


<script setup lang="ts">
  import { ref } from 'vue';
  import { MdEditor } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { addArticle } from '@/api/article'
  import { ElMessage } from 'element-plus'

  const title = ref()
  const file = ref()
  const content = ref()

  const handleFileChange = (event: any) => {
    file.value = event.target.files[0]
  }


  const submit = () => {
    if(file.value == undefined || title.value == '') {
      ElMessage.warning('请填写完整信息')
      return
    }

    addArticle(title.value,file.value, content.value).then(res=>{
      if(res.data.msg == '添加成功') {
        title.value = ''
        content.value = ''
        ElMessage.info('添加成功')
      } else {
        ElMessage.warning('添加失败')
      }
    }).catch(err => {
      ElMessage.warning('网络错误')
    })
  }
  


</script>


<style scoped>
.upload {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 50px;
}
.upload-button {
  margin-top: 20px;
}
.upload-input {
  width: 33%;
}
</style>