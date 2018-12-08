import Vue from 'vue'
import App from 'components/App'

export default function createApp(store, router) {
  return new Vue({
    name: 'Root',
    render: createElement => {
      return createElement(App)
    },
    store,
    router,
  })
}
