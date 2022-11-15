import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useAppStore = defineStore('app', () => {
  const state = reactive({
    spinner: false,
    loading: false,
  })

  const setSpinner = (state: any, value: boolean) => {
    state.spinner = value
  }

  const isLoading = (state: any, value: boolean) => {
    state.loading = value
  }

  return {
    state,
    setSpinner,
    isLoading,
  }
})
