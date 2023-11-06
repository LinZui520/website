import { defineStore } from 'pinia'

const useArticleStore = defineStore("article", {
  state: () => ({
    id: 0,
    title: "",
    content: ""
  }),

  getters: {

  },

  actions: {

  }
})

export default useArticleStore