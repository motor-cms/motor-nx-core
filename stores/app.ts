import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const updatingInBackground = ref(false);
  const sidebarOpen = ref(false)
  /**
   * Set the global loading state of the application, if showSpinner is set to true
   * a global spinner is shown.
   * @param value
   * @param showSpinner
   */
  const isLoading = (value: boolean) => {
    loading.value = value
  }

  const updateInBackground = (value: boolean) => {
    updatingInBackground.value = value;
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    loading,
    isLoading,
    updateInBackground,
    updatingInBackground,
    disableForms: loading,
    toggleSidebar,
    sidebarOpen
  }
})
