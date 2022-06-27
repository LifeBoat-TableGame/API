import { defineStore } from 'pinia';
import router from '../router';

export const useMainStore = defineStore("mainStoreID", {
  state: () => ({
    activeRoomId: 0,
    token: '',
    isAdmin: false,
    selfId: -1,
    name: 'noname',
  }),
  getters: {
    getToken: (state) => {
      state.token;
    }
  },
  actions: {
    getUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    logOut() {
      console.log('logging out...')
      router.push('/login')
    },
  },
});