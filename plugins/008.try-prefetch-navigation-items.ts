
import {storeToRefs} from "pinia";

export default defineNuxtPlugin( {
  async setup (nuxtApp) {
    const navigationStore = useNavigationStore();
    const userStore = useUserStore();
    const { getNavigationItems } = navigationStore;
    if (userStore.authenticated.value) {
      await getNavigationItems();
    }
  }
})
