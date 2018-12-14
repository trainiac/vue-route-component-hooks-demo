<template>
  <div>
    <router-link :to="{ name: 'home' }"> Home </router-link>
    <router-view />
  </div>
</template>

<script>
import api from 'api'
export default {
  name: 'UserApp',
  permissions(store, to) {
    return api.isPublic(to.params.userId).then(isPublic => {
      if (isPublic) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('UnAuthorized'))
    })
  },
}
</script>
