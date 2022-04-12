import { defineStore } from 'pinia';
export const useUserStore = defineStore("userStoreID", {
  state: () => ({
      token: '',
      name: 'Sam',
  }),
  getters: {
      getToken: (state) => {
        state.token;
      }
  },
  actions: {
    clearToken() {
      this.token = '';
    },
    setToken(value: string) {
      this.token = value;
    }
  }
});