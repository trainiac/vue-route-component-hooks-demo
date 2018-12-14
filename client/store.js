import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function createStore(initialState) {
  return new Vuex.Store({
    state() {
      return {
        users: {},
        userCollections: {},
        ...initialState,
      }
    },
    mutations: {
      receiveUserCollection(state, { collectionId, users }) {
        Vue.set(
          state.userCollections,
          collectionId,
          users.map(user => user.userId)
        )
        users.forEach(user => {
          Vue.set(state.users, user.userId, user)
        })
      },
      receiveUser(state, user) {
        Vue.set(state.users, user.userId, user)
      },
    },
    strict: true,
  })
}
