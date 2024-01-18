import { defineStore, } from 'pinia'
import { ref } from 'vue'
import useApi from "@zrm/motor-nx-core/composables/http/api";
import type NavigationItem from '@zrm/motor-nx-core/types/navigation-item';

export const useNavigationStore = defineStore('navigations', () => {
  const navigationItems = ref<Record<string, NavigationItem>>({})
  const activeParent = ref<string>("");
  const activeChild = ref<string>("");
  const api = useApi();
  const runtimeConfig = useRuntimeConfig();
  const loading = ref(false);

  const toggleMenu = async (slug: string) => {
    setActiveParent(slug);
    setActiveChild('');
  }

  const getNavigationItems = async (): Promise<void> => {
    isLoading(true);
    const { data } = await api.get('admin_navigations')
    navigationItems.value = data.value.data;
    isLoading(false);
  }

  const setActiveParent = (nav: string) => {
    activeParent.value = nav;
  }

  const setActiveChild = (nav: string) => {
    activeChild.value = nav;
  }

  const isLoading = (isLoading: boolean) => {
    loading.value = isLoading;
  }

  return {
    activeParent,
    activeChild,
    setActiveParent,
    setActiveChild,
    getNavigationItems,
    navigationItems,
    toggleMenu,
    isLoading,
    loading
  }
})
