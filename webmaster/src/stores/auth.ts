import { defineStore } from 'pinia';

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  permission: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  } as AuthState),
  getters: {
    permission: (state) => state.user?.permission
  },
  actions: {
    setAuth(user: User | null, token: string | null) {
      this.user = user;
      this.token = token;
    },
    clear() {
      this.user = null;
      this.token = null;
    },
    logout() {
      // 删除cookie中的token
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // 清除store中的状态
      this.clear();
      // 重定向到网站首页
      window.location.href = `${window.location.protocol}//${window.location.hostname}`;
    }
  }
});
