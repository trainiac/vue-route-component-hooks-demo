<template>
  <div>
    <div>{{ user.name }}</div>
  </div>
</template>

<script>
import api from 'api'
export default {
  name: 'User',
  permissions(store, to, from) {
    return api.fetchUser(to.params.userId).then(user => {
      store.commit('receiveUser', user)
    })
  },
  computed: {
    user() {
      const userId = this.$route.params.userId
      return this.$store.state.users[userId]
    },
  },
}
</script>
