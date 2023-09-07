import Repository from '../types/repository'
import {ref} from 'vue'
import {useToast} from 'vue-toastification'
import {useI18n} from 'vue-i18n'
import {useAppStore} from '../store/app'
import {useGridData} from "@zrm/motor-nx-core/composables/grid/gridData";

export default function callbackGrid<T>(
  repository: Repository,
  languagePrefix: string
) {
  const toast = useToast()
  const appStore = useAppStore()

  const {t} = useI18n()


  const rowsSortedByUpdatedAt = computed({
    // get rows sorted by updated_at
    get() {
      return rows.value?.sort((a,b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      })
    },
    // set rows
    set(newValue) {
      rows.value = newValue;
    }
  })

  const rows = ref<Array<T>>([])
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
        appStore.isLoading(true)
        await repository.delete(params.componentParams.record)
        // Remove record from rows for better ux
        removeRecordFromRows(params.componentParams.record);
        toast.success(t(languagePrefix + '.deleted'))
        appStore.isLoading(false)
        appStore.updateInBackground(true);
        // Fetch fresh dataset of rows in background to hydrate cache and rows
        await getGridData({}, '', false);
        appStore.updateInBackground(false);
        break
      case 'UpdateRecord':
        const payload: any = {}
        appStore.isLoading(true)
        payload[params.componentParams.property] = params.componentParams.value
        const newRecord = await repository.update(
          payload,
          params.componentParams.record
        )
        rows.value[params.componentParams.index] = newRecord.data.data
        toast.success(t(languagePrefix + '.updated'))
        appStore.isLoading(false)
        break
      default:
        console.log('UNHANDLED EVENT', params.componentParams)
    }
  }

  const { refreshGridData } = useGridData();

  const refreshRecords = async (params: any = {}) => {
    await getGridData(params, '', false);
  }

  const removeRecordFromRows = (record: number) => {
    console.log(`Removing record #${record}`);
    rows.value = rows.value.filter((row) => row.id !== record);
  }

  return {rows: rowsSortedByUpdatedAt, meta, refreshRecords, handleCellEvent}
}
