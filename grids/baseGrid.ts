import Repository from '../types/repository'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default function callbackGrid(
  repository: Repository,
  languagePrefix: string
) {
  const toast = useToast()

  const store = useStore()

  const { t } = useI18n()

  const rows = ref([])
  const meta = ref({ current_page: 1, from: 1, to: 1 })

  const refreshRecords = async (params: {}) => {
    // Show spinner
    // store.commit('motor/setSpinner', true)
    await repository.index(params).then((result) => {
      rows.value = result.data.data
      meta.value = result.data.meta
    })
    // Show spinner
    // store.commit('motor/setSpinner', false)
  }

  const replaceRecord = (record: any) => {}

  refreshRecords({})

  const handleCellEvent = async (params: {
    filterValues: any
    componentParams: any
  }) => {
    switch (params.componentParams.component) {
      case 'DeleteButton':
        // Delete the record
        await repository.delete(params.componentParams.record)

        toast.success(t(languagePrefix + '.deleted'))

        await refreshRecords(params.filterValues)
        break
      case 'UpdateRecord':
        const payload: any = {}
        payload[params.componentParams.property] = params.componentParams.value
        const newRecord = await repository.update(
          payload,
          params.componentParams.record
        )
        rows.value[params.componentParams.index] = newRecord.data.data
        toast.success(t(languagePrefix + '.updated'))
        break
      default:
        console.log('UNHANDLED EVENT', params.componentParams)
    }
  }
  return { rows, meta, refreshRecords, handleCellEvent }
}
