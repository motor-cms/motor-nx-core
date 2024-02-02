import {defineStore,} from 'pinia'
import {ref} from 'vue'

interface GridItem {
  name: string;
  filters: FilterItem[];
}

interface FilterItem {
  name: string;
  value: string;
}

export const useFilterStore = defineStore('filters', () => {
  const filterItems = ref<Record<string, GridItem>>({})

  console.log(filterItems.value);
  const getFilterValuesForGrid = (gridName: string) => {
    const returnValues = {};
    filterItems.value[gridName]?.filters.forEach((filter) => {
      returnValues[filter.name] = filter.value;
    });
    return returnValues;
  }

  const setFilterValuesForGrid = (gridName: string, filterValues: {}): void => {
    filterItems.value[gridName] = {name: gridName, filters: []}
    Object.keys(filterValues).forEach((index) => {
      filterItems.value[gridName].filters.push({name: index, value: filterValues[index]})
    })
  }

  return {
    filterItems,
    getFilterValuesForGrid,
    setFilterValuesForGrid
  }
}, {persist: true})
