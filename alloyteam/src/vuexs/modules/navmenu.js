// import api from 'API'
import * as types from 'VUEX/mutation-types'

const state = {
  full: false,
  open: false
}

const getters = {
  getOpenState: state => state.open,
  getFullState: state => state.full
}

const actions = {
  fullNavMenu ({ commit }) {
    commit('FULL_NAV_MENU')
  },
  openNavMenu ({ commit }) {
    commit('OPEN_NAV_MENU')
  },
  closeNavMenu ({ commit }) {
    commit('CLOSE_NAV_MENU')
  },
  toggleNavMenu ({ commit }) {
    commit('TOGGLE_NAV_MENU')
  }
}

const mutations = {
  [types.FULL_NAV_MENU] (state) {
    state.full = true
  },
  [types.OPEN_NAV_MENU] (state) {
    state.full = false
    state.open = true
  },
  [types.CLOSE_NAV_MENU] (state) {
    state.full = false
    state.open = false
  },
  [types.TOGGLE_NAV_MENU] (state) {
    state.open = !state.open
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
