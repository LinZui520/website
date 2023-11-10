import { defineStore } from 'pinia'

const useUserStore = defineStore("account", {
  state: () => ({
    id: 0,
    nickname: '',
    username: '',
    isLogin: false,
  }),

  getters: {

  },

  actions: {

  }
})

export default useUserStore