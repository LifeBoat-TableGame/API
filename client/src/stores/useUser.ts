import { defineStore } from 'pinia';
export const useUserStore = defineStore("userStore", {
  state: () => ({
      token: 0,
      name: 'Sam',
  }),
  getters: {
      doubleToken: (state) => {
        state.token*2;
      }
  },
  actions: {
    reset () {
      this.token = 0;
    },
    addOne() {
      this.token++;
    }
  }
});