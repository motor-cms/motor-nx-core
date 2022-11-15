import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const spinnerActive = ref(false)
  const loading = ref(false)

  const setSpinner = (value: boolean) => {
    spinnerActive.value = value
  }

  const isLoading = (value: boolean, showSpinner: boolean) => {
    loading.value = value
    setSpinner(showSpinner)
  }

  return {
    spinnerActive,
    loading,
    setSpinner,
    isLoading,
  }
})
