import {defineStore} from 'pinia'
import { ref} from 'vue'
import {useAppStore} from './app'
import { CookieRef} from "#app";
import useApi from "@zrm/motor-nx-core/composables/http/api";
import {useSanctumFetch} from "#build/imports";

export const useUserStore = defineStore('users', () => {
  const appStore = useAppStore()
  const api = useApi();
  // const authenticated = ref(false)
  // const user = ref<Record<string, any> | null>(null)
  const token = ref("")
  const signInError = ref('')
  const userHasClient = computed(() => user.value?.client_id);
  const { login, logout, user, isAuthenticated: authenticated } = useSanctumAuth()

  // const setAuthenticationStatus = (value: boolean) => {
  //   authenticated.value = value
  // }

  const setUser = (value: Record<string, any>|null) => {
    user.value = value
    // setAuthenticationStatus(true)
  }

  // const setToken = (value: string) => {
  //   token.value = value
  // }

  const removeUser = async () => {
    await logout()
    setUser(null)
  }

  const doLogin = async (email: string, password: string): Promise<void> => {

    const credentials = {
      email: email,
      password: password,
      remember: true,
    }

    await login(credentials)
    setUser(user.value.data)



    // const runTimeConfig = useRuntimeConfig();
      // await useFetch(runTimeConfig.public.backendApiBaseUrl + 'sanctum/csrf-cookie');
      // const {data} = await api.post('/login', {
      //   email,
      //   password
      // })
      // setToken(data.value.data.token)
      // const {data: meResponse} = await api.get('me')
      // setUser(meResponse.value.data)
  }

  // const loginFromStorage = async (tkn: CookieRef<string|null|undefined>): Promise<boolean> => {
  //   if (!tkn.value?.length) {
  //     return false;
  //   }
  //   // setToken(tkn.value);
  //   const {data: meResponse, pending, error, refresh } = await api.get('me')
  //   if (error.value) {
  //     removeUser();
  //     appStore.isLoading(false)
  //     return false;
  //   }
  //   setUser(meResponse.value.data)
  //   appStore.isLoading(false)
  //   return true;
  // }
  //
  // const refreshUser = async () => {
  //   const {data: meResponse} = await api.get('me')
  //   if (meResponse) {
  //     setUser(meResponse.value.data)
  //   }
  // }

  const signIn = async (values: { email: ''; password: '' }) => {
    return doLogin(values.email, values.password)
  }

  return {
    authenticated,
    user,
    token,
    signInError,
    // setAuthenticationStatus,
    setUser,
    signIn,
    // refreshUser,
    removeUser,
    // loginFromStorage,
    userHasClient
  }
}, { persist: true})
