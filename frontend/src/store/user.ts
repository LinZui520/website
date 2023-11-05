import { defineStore } from 'pinia'

const useUserStore = defineStore("account", {
    state: () => ({
        username: '',
        isLogin: false,
    }),

    getters: {

    },

    actions: {

    }
})

export default useUserStore