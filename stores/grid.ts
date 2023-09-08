import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'

export const useGridStore = defineStore('grid', () => {

  const meta = ref<Object>();
  const init = (m: Object) => {
    meta.value = m;
  }

  const selectedItems = ref<Array<Record<string, any>>>([]);
  const allSelected = ref(false);
  const pageSelected = computed(() => selectedPageMap.value.get(meta.value.current_page) === true);
  const selectedPageMap = ref(new Map())


  const addSelectedItem = (item: Record<string, any>) => {
    selectedItems.value.push(item);
  }

  const removeSelectedItem = (item: Record<string, any>) => {
    selectedItems.value = selectedItems.value.filter(i => i.id !== item.id)
  }

  const selectedItemsLength = computed(() => selectedItems.value.length)

  const setSelectedItems = (items: Array<Record<string, any>>) => {
    selectedItems.value = items;
  }

  const selectItem = (item: Record<string, any>) => {
    if (isSelected(item)) {
      removeSelectedItem(item);
    } else
    {
      addSelectedItem(item);
    }
  }

  const isSelected = (item: Record<string, any>) => {
    return selectedItems.value.filter(i => i.id === item.id ).length;
  }

  const deselectAll = () => {
    selectedPageMap.value = new Map();
    allSelected.value = false;
    selectedItems.value = [];
  }

  return {
    allSelected,
    pageSelected,
    selectedItems,
    selectedItemsLength,
    selectedPageMap,
    setSelectedItems,
    selectItem,
    isSelected,
    addSelectedItem,
    removeSelectedItem,
    init,
    meta,
    deselectAll
  }
})
