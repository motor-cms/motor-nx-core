import { createStore, createLogger } from 'vuex'
import motor from './motor'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    motor,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})
