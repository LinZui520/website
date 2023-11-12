<template>
  <div class="about-items">
    <el-divider data-aos="fade-up" style="width: 90%;margin: 0 auto;margin-top: 200px;" />
      <h1 class="about-title" data-aos="fade-up">关于我</h1>
    <el-divider data-aos="fade-up" style="width: 90%;margin: 0 auto;margin-top: 20px;"/>
    <p class="about-item item-left" data-aos="fade-up" style="margin-top: 100px;">欢迎来到生活以外的世界</p>

    <h1 class="about-item item-left" data-aos="fade-up" style="margin-top: 50px;">Yangming He</h1>
    <p class="about-item item-left" data-aos="fade-up" style="margin-top: 30px;">
      Hi，大家好，我是本站博主，2003年到达这个世界，目前就读于南昌大学。
      搭建本网站的目的是分享自己所学习的知识，与大家一起讨论。
      本站代码完全开源，如果你正在学习如何搭建博客，欢迎借鉴我的代码。
      最后祝每一个看到这段话的陌生人：生活愉快！
    </p>
 
    <el-divider data-aos="fade-up" style="width: 90%;margin: 0 auto;margin-top: 200px;" />
    <h1 class="about-title" data-aos="fade-up">与你</h1>
    <el-divider data-aos="fade-up" style="width: 90%;margin: 0 auto;margin-top: 20px;"/>
    <p class="about-item item-right" data-aos="fade-up" style="margin-top: 100px;">你好， 朋友</p>
    <p class="about-item item-right" data-aos="fade-up" style="margin-top: 0px;">
      希望你在走了很远的路之后，最终找到的人是你自己
    </p>

    <el-divider data-aos="fade-up" style="width: 90%;margin: 0 auto;margin-top: 200px;" />
    <h1 class="about-title" data-aos="fade-up">网站搭建</h1>
    <el-divider data-aos="fade-up" style="width: 90%;margin: 0 auto;margin-top: 20px;"/>
    <p class="about-item item-left" data-aos="fade-up" style="margin-top: 100px;">
      <a 
        href="https://github.com/LinZui520/blog"  
        style="font-family: YouSheYuFeiTeJianKangTi;
          font-size: larger;
          color: #909399;
          text-decoration:none
        "
        target="_blank"
      >
        GitHub源代码(点击跳转)
      </a>
    </p>
    <h1 class="about-item item-left" data-aos="fade-up" style="margin-top: 100px;">前端技术栈</h1>
    <p class="about-item item-left" data-aos="fade-up">
      Vue3 + Vite + TypeScript + Element Plus + Pinia + Axios + AOS
    </p>
    <h1 class="about-item item-left" data-aos="fade-up" style="margin-top: 100px;">后端技术栈</h1>
    <p class="about-item item-left" data-aos="fade-up" style="margin-bottom: 200px;">
      Go + Gin + Gorm + JWT + MySQL
    </p>

  </div>
</template>


<script setup lang="ts">
  
</script>


<style scoped>
.about-items {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.about-title {
  font-family: YouSheYuFeiTeJianKangTi;
  font-size: larger;
  color: #909399;
  margin: 0 auto;
  margin-top: 20px;
  text-align: center;

}
.about-item {
  font-family: YouSheYuFeiTeJianKangTi;
  font-size: larger;
  color: #909399;
  margin-top: 30px;
}

.item-left {
  /* margin-left: 10%; */
  margin-right: 50%;
}
.item-right {
  margin-left: 50%;
  /* margin-right: 10%; */
}
</style>