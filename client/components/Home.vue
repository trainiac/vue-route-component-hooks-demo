<template>
  <div>
    <div>The Big Lebowski Trio</div>
    <router-link
      v-for="user in users"
      :key="user.userId"
      :to="{ name: 'user', params: { userId: user.userId } }"
    >
      {{ user.name }}
    </router-link>
  </div>
</template>

<script>
import api from 'api'
export default {
  name: 'Home',
  permissions(store, to, from) {
    return api.isAuthenticated().then(isAuth => {
      if (isAuth) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('Not Authenticated'))
    })
  },
  criticalData(store) {
    return api.fetchAllUsers().then(users => {
      store.commit('receiveUserCollection', {
        collectionId: 'all',
        users,
      })
    })
  },
  computed: {
    users() {
      return this.$store.state.userCollections.all.map(userId => {
        return this.$store.state.users[userId]
      })
    },
  },
}
</script>
