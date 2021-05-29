import axios from 'axios'
import { ref } from 'vue'
import { useStore } from 'vuex'
// import jwtDecode from 'jwt-decode';

export default function useAuth() {
  const token = !!localStorage.getItem('token')
  // const authenticated = ref(token)
  const signInError = ref('')
  // const user = ref(JSON.parse(localStorage.getItem('user')))

  const store = useStore()

  store.commit('motor/setAuthenticationStatus', token)
  store.commit('motor/setUser', JSON.parse(localStorage.getItem('user')))

  const login = async (email: string, password: string) => {
    await axios.get('/sanctum/csrf-cookie')
    await axios
      .post('/api/auth/login', {
        email: email,
        password: password,
      })
      .then(async (response) => {
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + response.data.data.token
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
        axios.defaults.headers.put['Content-Type'] = 'multipart/form-data'

        localStorage.setItem('token', response.data.data.token)
        await axios.get('/api/me').then((response) => {
          localStorage.setItem('user', JSON.stringify(response.data.data))
          store.commit('motor/setAuthenticationStatus', true)
        })
      })
      .catch((error) => {
        if (error.response && error.response.status) {
          signInError.value = error.response.status
        }
        console.error('HANDLE THIS', error)
      })
    console.log('all done')
    // return 404;
  }

  const refreshUser = async () => {
    await axios.get('/api/me').then((response) => {
      localStorage.setItem('user', JSON.stringify(response.data.data))
      store.commit('motor/setUser', response.data.data)
    })
  }

  const signIn = (values: { email: ''; password: '' }) => {
    return login(values.email, values.password)
  }

  return {
    signIn,
    signInError,
    refreshUser,
  }
}
