import Repository from '../types/repository'
import {ref} from 'vue'
import {useToast} from 'vue-toastification'
import {useI18n} from 'vue-i18n'
import {useAppStore} from '../store/app'
import {useGridData} from "@zrm/motor-nx-core/composables/grid/gridData";

export default function callbackGrid(
  repository: Repository,
  languagePrefix: string
) {
  const toast = useToast()
  const appStore = useAppStore()

  const {t} = useI18n()

  const rows = ref([])
  const meta = ref({current_page: 1, from: 1, to: 1})

  const getGridData = async (params: any, id: string = '', cached: boolean = true) => {
      const { data: result, pending, error, refresh } = await repository.index(params, cached);
      if (error.value) throw new Error(error)
      rows.value = result.value.data
      meta.value = result.value.meta
  }

  const handleCellEvent = async (params: {
    filterValues: any
    componentParams: any
  }) => {
    switch (params.componentParams.component) {
      case 'DeleteButton':
        // Delete the record
        appStore.isLoading(true, true)
        await repository.delete(params.componentParams.record)
        await refreshGridData([getGridData], [], params.filterValues, '', false)
        toast.success(t(languagePrefix + '.deleted'))
        appStore.isLoading(false, false)
        break
      case 'UpdateRecord':
        const payload: any = {}
        appStore.isLoading(true, true)
        payload[params.componentParams.property] = params.componentParams.value
        const newRecord = await repository.update(
          payload,
          params.componentParams.record
        )
        rows.value[params.componentParams.index] = newRecord.data.data
        toast.success(t(languagePrefix + '.updated'))
        appStore.isLoading(false, false)
        break
      default:
        console.log('UNHANDLED EVENT', params.componentParams)
    }
  }

  const { refreshGridData } = useGridData();

  const refreshRecords = async (params: any = {}) => {
    await refreshGridData([getGridData], [getGridData], params, '', true, true)
  }

  onMounted(async () => {
    await refreshRecords();
  })

  return {rows, meta, refreshRecords, handleCellEvent}
}
