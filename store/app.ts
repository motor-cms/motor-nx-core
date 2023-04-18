import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const loadingStackMainProcess = ref(0);
  const loadingStackBackgroundProcess = ref(0);
  const updatingInBackground = ref(false);
  const disableForms = computed(() => loading.value);


  const canUnloadMainProcess = computed(() => loadingStackMainProcess.value <= 1)
  const canUnloadBackgroundProcess = computed(() => loadingStackBackgroundProcess.value <= 1)

  /**
   * Set the global loading state of the application, if showSpinner is set to true
   * a global spinner is shown.
   * @param value
   * @param showSpinner
   */
  const isLoading = (value: boolean) => {
    if (value) {
      loadingStackMainProcess.value++;
      loading.value = value
    } else {
      if (loadingStackMainProcess.value > 0) loadingStackMainProcess.value--;
      if (canUnloadMainProcess.value) {
        loading.value = value
      }
    }
  }

  const updateInBackground = (value: boolean) => {
    if (value) {
      loadingStackBackgroundProcess.value++;
      updatingInBackground.value = value;
    } else {
      if (loadingStackBackgroundProcess.value > 0) loadingStackBackgroundProcess.value--;
      if (canUnloadBackgroundProcess.value) {
        console.log("unloading");
        updatingInBackground.value = value;
      }
    }
  }

  return {
    loading,
    isLoading,
    updateInBackground,
    updatingInBackground,
    disableForms,
    loadingStackMainProcess,
    loadingStackBackgroundProcess,
    canUnloadMainProcess,
    canUnloadBackgroundProcess
  }
})
