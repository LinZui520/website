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
    }
  }
});
