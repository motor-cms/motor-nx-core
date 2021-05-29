import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useToast } from 'vue-toastification'
// import Repository from '@/types/repository'
import Ref from '../types/model'
import ObjectSchema from 'yup/lib/object'
import { useStore } from 'vuex'

export default function baseForm(
  languageFilePrefix: string,
  routePrefix: string,
  repository: any,
  model: Ref<{ [index: string]: any }>,
  schema: ObjectSchema<{}>,
  sanitizer: (formData: object) => void = () => {},
  afterSubmit: () => void = () => {},
  repositoryParams?: {}
) {
  // Load i18n module
  const { t } = useI18n()

  // Load router
  const router = useRouter()

  const store = useStore()

  const toast = useToast()

  // Get record from id and set values. Redirect back and show error if record was not found
  const getData = async (id: number | string) => {
    store.commit('motor/setSpinner', true)

    const response = await (<any>(
      repository.get(<number>id, repositoryParams).catch((e: Error) => {
        toast.error(t('global.record_not_found'))
        router.replace({ name: routePrefix })
      })
    ))
    model.value = response.data.data
    store.commit('motor/setSpinner', false)
  }

  // Initialize form with default values and the validation schema
  const { handleSubmit } = useForm({
    initialValues: model,
    validationSchema: schema,
  })

  const onSubmit = handleSubmit(async (values) => {
    // Show spinner
    // store.commit('motor/setSpinner', true)

    for (const [key, value] of Object.entries(values)) {
      if (key !== 'id') {
        model.value[key] = value
      }
    }

    const formData = <any>{}

    for (const [key, value] of Object.entries(values)) {
      if (key !== 'id') {
        formData[key] = value
      }
    }

    if (sanitizer !== null) {
      sanitizer(formData)
    }

    let response
    if (model.value.id) {
      response = await repository.update(
        formData,
        model.value.id,
        repositoryParams
      )
    } else {
      model.value.id = null
      response = await repository.create(formData, repositoryParams)
    }

    // Disable spinner
    store.commit('motor/setSpinner', false)

    switch (response.status) {
      case 200:
        toast.success(t(languageFilePrefix + '.updated'))
        await router.replace({ name: routePrefix })
        await afterSubmit()
        break
      case 201:
        toast.success(t(languageFilePrefix + '.created'))
        await router.replace({ name: routePrefix })
        await afterSubmit()
        break
      default:
        toast.error(t('global.error_occurred'))
        break
    }
  })

  return {
    getData,
    handleSubmit,
    onSubmit,
  }
}
