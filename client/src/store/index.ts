import { createStore } from 'vuex'
import router from '../router'
import {
    ADD_NOTE,
    CLEAR_SESSION,
    SET_NOTES,
    SET_TOKEN,
    SET_NAME,
    SET_USERNAME,
    SET_EMAIL,
    CHANGE_USER,
  } from './mutation-types.js'

const store = createStore({
  state: {
    userData: "USER!",
    token: "",
    notes: [],
    username: "",
    first_name: "",
    email: "",
  },
  mutations: {
      [CHANGE_USER] (state) {
        state.userData="user?"
      },
      [CLEAR_SESSION] (state) {
        state.token=""
        state.username=""
        state.first_name=""
        state.email=""
      },
      [SET_TOKEN] (state, token) {
        state.token = token
        //this.dispatch('getUserByToken')
      },
      [SET_NAME] (state, name) {
        state.name = name
      },
      [SET_USERNAME] (state, username) {
        state.username = username
      },
      [SET_EMAIL] (state, email) {
        state.email = email
      },
      [ADD_NOTE] (state, note) {
        state.notes = [note, ...state.notes]
      },
      [SET_NOTES] (state, { notes }) {
        state.notes = notes
      }
  },
  actions: {
    createNote ({ commit }, noteData) {
        Note.create(noteData, this.state.token)
          .then(note => {
            commit(ADD_NOTE, note)
          })
          .catch(error => {
            console.log(error);
            router.push('/login')
          })
      },
      getUserByToken ({ commit }) {
        Auth.getUserByToken({'mytoken': this.state.token})
          .then(data => {
              commit(SET_EMAIL, "")
              commit(SET_NAME, "")
            if(data['email']!=undefined)
              commit(SET_EMAIL, data['email'])
            if(data['first_name']!=undefined)
              commit(SET_NAME, data['first_name'])
            if(data['username']!=undefined)
              commit(SET_USERNAME, data['username'])
            else commit(CLEAR_SESSION)
          })
          .catch(error => {
            console.log(error)
            router.push('/login')
          })
      },
      signIn ({ commit }, configData) {
        Auth.login(configData)
          .then(data => {
            commit(SET_TOKEN, data.token), router.push('/')
          })
          .catch(error  => console.log(error))
      },
      register ({ commit }, configData) {
        Auth.register(configData)
          .then(data => {
            commit(SET_TOKEN, data.token), router.push('/')
          })
          .catch(error => console.log(error))
      },
  },
  getters: {

  }
})

export default store