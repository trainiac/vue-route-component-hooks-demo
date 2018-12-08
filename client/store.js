import Vue from 'vue'
import Vuex from 'vuex'
import {
  trackModules,
  assignRegisteredModules,
  getRegisteredModules,
} from 'store/modulesManager'
Vue.use(Vuex)
export function createStore(initialState) {
  const storeConfig = {}

  storeConfig.modules = require('./modules').default
  module.hot.accept(['./modules/index.js'], () => {
    const newModules = require('./modules').default
    store.hotUpdate({
      modules: newModules,
    })
  })

  const trackedModules = trackModules(storeConfig.modules)

  storeConfig.actions = {
    reset({ commit }) {
      // empty all resources from store
      const registeredModules = getRegisteredModules(store)
      const modNamespaces = Object.keys(registeredModules)
      modNamespaces.forEach(modNamespace => {
        if (registeredModules[modNamespace].reset) {
          commit(`${modNamespace}/reset`)
        }
      })
    },
  }
  if (initialState) {
    storeConfig.state = initialState
  }
  storeConfig.strict = true
  const store = new Vuex.Store(storeConfig)
  assignRegisteredModules(store, trackedModules)
  return store
}
