import { defineStore, storeToRefs } from 'pinia'
import { reactive, ref, toRefs } from 'vue'
import axios, { AxiosError } from 'axios'
import AxiosResponse from '../types/axios-response'
import { useAppStore } from './app'

export const useUserStore = defineStore('users', () => {
  const appStore = useAppStore()
  const authenticated = ref(!!localStorage.getItem('token'))
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const token = ref(localStorage.getItem('token'))
  const signInError = ref('')

  const setAuthenticationStatus = (value: boolean) => {
    authenticated.value = value
  }

  const setUser = (value: object) => {
    user.value = value
  }

  const setToken = (value: string) => {
    token.value = value
  }

  const removeUser = () => {
    authenticated.value = false
    user.value = null
    token.value = null
  }

  const login = async (email: string, password: string) => {
    try {
      appStore.isLoading(true, true)
      await axios.get('/sanctum/csrf-cookie')
      const loginResponse: AxiosResponse = await axios.post('/api/auth/login', {
        email: email,
        password: password,
      })

      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + loginResponse.data.data.token
      axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
      axios.defaults.headers.put['Content-Type'] = 'multipart/form-data'

      localStorage.setItem('token', loginResponse.data.data.token)
      setToken(loginResponse.data.data.token)

      const meResponse: AxiosResponse = await axios.get('/api/me')
      localStorage.setItem('user', JSON.stringify(meResponse.data.data))
      setAuthenticationStatus(true)
      setUser(meResponse.data.data)
    } catch (error: any) {
      if (error.response && error.response.status) {
        signInError.value = error.response.status
      }
      console.error('HANDLE THIS', error)
    }
    appStore.isLoading(false, false)
  }

  const refreshUser = async () => {
    await axios.get('/api/me').then((response: AxiosResponse) => {
      localStorage.setItem('user', JSON.stringify(response.data.data))
      setUser(response.data.data)
    })
  }

  const signIn = async (values: { email: ''; password: '' }) => {
    return await login(values.email, values.password)
  }

  return {
    authenticated,
    user,
    token,
    signInError,
    setAuthenticationStatus,
    setUser,
    signIn,
    refreshUser,
    removeUser,
  }
})
