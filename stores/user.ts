import {defineStore} from 'pinia'
import { ref} from 'vue'
import {useAppStore} from './app'
import { CookieRef} from "#app";
import useApi from "@zrm/motor-nx-core/composables/http/api";

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
    console.log("set token", token)
  }

  const removeUser = () => {
    authenticated.value = false
    user.value = null
    token.value = ""
    const cookie = useCookie('auth_token');
    cookie.value = "";
  }

  const login = async (email: string, password: string): Promise<void> => {
      const runTimeConfig = useRuntimeConfig();
      await useFetch(runTimeConfig.public.backendApiBaseUrl + 'sanctum/csrf-cookie');
      const {data} = await api.post('auth/login', {
        email,
        password
      })
      setToken(data.value.data.token)
      const {data: meResponse} = await api.get('me')
      setUser(meResponse.value.data)
  }

  const loginFromStorage = async (tkn: CookieRef<string|null|undefined>): Promise<boolean> => {
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
    return login(values.email, values.password)
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
