
import {storeToRefs} from "pinia";

export default defineNuxtPlugin( {
  async setup (nuxtApp) {
    const userStore = useUserStore();
    const {authenticated, token: userToken} = storeToRefs(userStore)
    const token = useCookie('auth_token');
    console.log('token', token.value)
    if (!authenticated.value && token.value?.length) {
      await userStore.loginFromStorage(token);
    }
  }
})
