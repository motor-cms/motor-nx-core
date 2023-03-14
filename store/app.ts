import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const spinnerActive = ref(false)
  const loading = ref(false)
  const updatingInBackground = ref(false);
  const route = useRoute();
  const disableForms = computed(() => loading.value);

  const setSpinner = (value: boolean) => {
    spinnerActive.value = value
  }

  /**
   * Set the global loading state of the application, if showSpinner is set to true
   * a global spinner is shown.
   * @param value
   * @param showSpinner
   */
  const isLoading = (value: boolean, showSpinner: boolean) => {
    loading.value = value
    setSpinner(showSpinner)
  }

  // const updateInBackground = async (backgroundFunction: (params: any) => Promise<void>) => {
  //   try {
  //     updatingInBackground.value = true;
  //     await backgroundFunction()
  //   } catch (e) {
  //     console.log("Error updating in background: " + backgroundFunction)
  //   } finally {
  //     updatingInBackground.value = true;
  //   }
  // }

  const updateInBackground = (value: boolean) => {
    updatingInBackground.value = value;
  }

  return {
    spinnerActive,
    loading,
    setSpinner,
    isLoading,
    updateInBackground,
    updatingInBackground,
    disableForms
  }
})
