// import getters from './getters'
// import mutations from './mutations'
// import actions from './actions'

export default {
  namespaced: true,
  state: {
    authenticated: <boolean>false,
    user: {},
    spinner: false,
  },
  mutations: {
    setAuthenticationStatus(state: any, value: boolean) {
      state.authenticated = value
    },
    setUser(state: any, value: object) {
      state.user = value
    },
    setSpinner(state: any, value: boolean) {
      state.spinner = value
    },
  },
  // getters,
  // mutations,
  // actions,
}
