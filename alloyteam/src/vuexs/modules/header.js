// import api from 'API'
import * as types from 'VUEX/mutation-types'

const state = {
  showLoading: false,
  doneLoading: false,
  loadFailed: false
}

const getters = {
  getHeaderState: state => state
}

const actions = {
  triggerLoadAnimation ({ commit }) {
    commit(types.TRIGGER_LOAD_ANIMATION)
  },
  triggerLoadAnimationDone ({ commit }) {
    commit(types.TRIGGER_LOAD_ANIMATION_DONE)
    setTimeout(() => {
      commit(types.HIDE_LOAD_ANIMATION)
    }, 600)
  },
  requestFailed ({ commit }) {
    commit('REQUEST_FAILED')
  }
}

const mutations = {
  [types.TRIGGER_LOAD_ANIMATION] (state) {
    state.showLoading = !state.loadFailed
  },
  [types.TRIGGER_LOAD_ANIMATION_DONE] (state) {
    state.loadFailed = false
    state.doneLoading = true
  },
  [types.HIDE_LOAD_ANIMATION] (state) {
    state.showLoading = false
    state.loadFailed = false
    state.doneLoading = false
  },
  [types.REQUEST_FAILED] (state) {
    state.loadFailed = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
