<template>
  <div class="about-items">
    <h1 class="about-item" data-aos="fade-up" style="margin-top: 50px;">关于我</h1>
    <p class="about-item" data-aos="fade-up">欢迎来到生活以外的世界</p>
    <h1 class="about-item" data-aos="fade-up" style="margin-top: 50px;">Yangming He</h1>
    <p class="about-item" data-aos="fade-up">
      Hi，大家好，我是本站博主，2003年到达这个世界，目前就读于南昌大学。
      搭建本网站的目的是分享自己所学习的知识，与大家一起讨论。
      本站源代码完全开源，如果你正在学习如何搭建博客，欢迎借鉴我的代码。
      最后祝每一个看到这段话的陌生人：生活愉快！
    </p>
 

    <h1 class="about-item" data-aos="fade-up" style="margin-top: 100px;">与你</h1>
    <p class="about-item" data-aos="fade-up">你好， 朋友</p>
    <p class="about-item" data-aos="fade-up" style="margin-top: 0px;">
      希望你在走了很远的路之后，最终找到的人是你自己
    </p>

    <h1 class="about-item" data-aos="fade-up" style="margin-top: 100px;">网站搭建</h1>
    <p class="about-item" data-aos="fade-up">
      <a 
        href="https://github.com/LinZui520/blog"  
        style="font-family: YouSheYuFeiTeJianKangTi;
          font-size: larger;
          color: #909399;
          text-decoration:none
        "
        target="_blank"
      >
        GitHub源代码
      </a>
    </p>
    <h1 class="about-item" data-aos="fade-up" style="margin-top: 30px;">前端</h1>
    <p class="about-item" data-aos="fade-up">
      Vue3 + Vite + TypeScript + Element Plus + Pinia + Axios + AOS
    </p>
    <h1 class="about-item" data-aos="fade-up" style="margin-top: 30px;">后端</h1>
    <p class="about-item" data-aos="fade-up">
      Go + Gin + Gorm + MySQL + Redis
    </p>


    <p style="height: 200px;"></p>
  </div>
</template>


<script setup lang="ts">
  import AOS from 'aos'
  AOS.init()
</script>


<style scoped>
.about-items {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.about-item {
  font-family: YouSheYuFeiTeJianKangTi;
  font-size: larger;
  color: #909399;
  width: 50%;
  margin: 0 auto;
  margin-top: 20px;
  margin-left: 10%;
}
</style>