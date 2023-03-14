import { defineStore, storeToRefs } from 'pinia'
import { reactive, ref, toRefs } from 'vue'
import { useAppStore } from './app'
import useApi from "motor-nx-core/composables/http/api";
import {AsyncData} from "#app";

export const useUserStore = defineStore('users', () => {
  const appStore = useAppStore()
  const api = useApi();
  const authenticated = ref(false)
  const user = ref<Record<string, any> | null>(null)
  const token = ref("")
  const signInError = ref('')

  const setAuthenticationStatus = (value: boolean) => {
    authenticated.value = value
  }

  const setUser = (value: Record<string, any>) => {
    user.value = value
  }

  const setToken = (value: string) => {
    token.value = value
    console.log("set token", token)
  }

  const removeUser = () => {
    authenticated.value = false
    user.value = null
    token.value = ""
    localStorage.removeItem('token')
  }

  const login = async (email: string, password: string) => {
    try {
      appStore.isLoading(true, true)
      await useFetch(import.meta.env.VITE_PUBLIC_API_BASE_URL + 'sanctum/csrf-cookie');
      const { data } = await api.post(  'auth/login', {
          email,
          password
      })
      setToken(data.value.data.token)
      localStorage.setItem('token', data.value.data.token)
      const { data: meResponse } = await api.get( 'me')
      setAuthenticationStatus(true)
      setUser(meResponse.value.data)
    } catch (error: any) {
      if (error.response && error.response.status) {
        signInError.value = error.response.status
      }
      console.error('HANDLE THIS', error)
    } finally {
      appStore.isLoading(false, false)
    }
  }

  const loginFromStorage = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
      setToken(token);
      appStore.isLoading(true, true)
      const { data: meResponse } = await api.get( 'me')
      setAuthenticationStatus(true)
      setUser(meResponse.value.data)
      appStore.isLoading(false, false)
  }

  const refreshUser = async () => {
    const { data: meResponse } = await api.get('me')
    if (meResponse) {
      setUser(meResponse.value.data)
    }
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
    loginFromStorage
  }
})
