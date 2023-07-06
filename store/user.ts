import {defineStore, storeToRefs} from 'pinia'
import {reactive, ref, toRefs} from 'vue'
import {useAppStore} from './app'
import useApi from "@zrm/motor-nx-core/composables/http/api";
import {AsyncData} from "#app";
import {sha256} from "ohash";

export const useUserStore = defineStore('users', () => {
  const appStore = useAppStore()
  const api = useApi();
  const authenticated = ref(false)
  const user = ref<Record<string, any> | null>(null)
  const token = ref("")
  const signInError = ref('')
  const userHasClient = computed(() => user.value?.client_id);

  const setAuthenticationStatus = (value: boolean) => {
    authenticated.value = value
  }

  const setUser = (value: Record<string, any>) => {
    user.value = value
    setAuthenticationStatus(true)
  }

  const setToken = (value: string) => {
    token.value = value
    const tkn = useCookie('auth_token')
    tkn.value = value;
    console.log("set token", token)
  }

  const removeUser = () => {
    authenticated.value = false
    user.value = null
    token.value = ""
    const tkn = useCookie('auth_token')
    tkn.value = "";
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      appStore.isLoading(true)
      await useFetch(import.meta.env.VITE_PUBLIC_API_BASE_URL + 'sanctum/csrf-cookie');
      const {data} = await api.post('auth/login', {
        email,
        password
      })
      setToken(data.value.data.token)
      const {data: meResponse} = await api.get('me')
      setUser(meResponse.value.data)
    } catch (error: any) {
      if (error.response && error.response.status) {
        signInError.value = error.response.status
      }
      console.error('HANDLE THIS', error)
    } finally {
      appStore.isLoading(false)
    }
  }

  const loginFromStorage = async (): Promise<boolean> => {
    const tkn = useCookie('auth_token')
    if (!tkn.value?.length) {
      return false;
    }
    setToken(tkn.value);
    console.log("token", tkn );
    const {data: meResponse, pending, error, refresh } = await api.get('me')
    console.log("data2", meResponse.value);
    if (error.value) {
      removeUser();
      appStore.isLoading(false)
      return false;
    }
    setUser(meResponse.value.data)
    appStore.isLoading(false)
    return true;
  }

  const refreshUser = async () => {
    const {data: meResponse} = await api.get('me')
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
    loginFromStorage,
    userHasClient
  }
})
