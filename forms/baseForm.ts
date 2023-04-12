import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useToast } from 'vue-toastification'
import Repository from '@zrm/motor-nx-core/types/repository'
import Ref from '../types/model'
import {useAppStore} from "@zrm/motor-nx-core/store/app";
import {Exception} from "sass";
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
import {ObjectSchema} from "yup";

export default function baseForm(
  languageFilePrefix: string,
  routePrefix: string,
  repository: any,
  model: Ref<{ [index: string]: any }>,
  schema: ObjectSchema<Record<any, any>>,
  sanitizer: (formData: object) => void = () => {},
  afterSubmit: () => void = () => {},
  repositoryParams?: {}
) {
  // Load i18n module
  const { t } = useI18n()

  // Load router
  const router = useRouter()
  const route = useRoute();

  const toast = useToast()
  const appStore = useAppStore();

  // Get record from id and set values. Redirect back and show error if record was not found
  const getData = async () => {
    try {
      if (!route.params.id) return;
      const id: number = Number(route.params.id)
      console.log(repositoryParams);
      const {data} = await repository.get(id, repositoryParams)
      model.value = data.value.data
    } catch (e) {
      toast.error(t('global.record_not_found'))
      router.replace({ name: routePrefix })
    }
  }

  // Initialize form with default values and the validation schema
  const { handleSubmit, setFieldValue } = useForm({
    initialValues: model,
    validationSchema: schema,
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      appStore.isLoading(true, true);
      for (const [key, value] of Object.entries(values)) {
        if (key !== 'id') {
          model.value[key] = value
        }
      }

      const formData = reactive<any>(values)
      delete formData.id;

      console.log("FORMDATA", formData);
      if (sanitizer !== null) {
        sanitizer(formData)
      }


      if (model.value.id) {
        const { data, pending, error, refresh } = await repository.update(
          formData,
          model.value.id,
          repositoryParams
        )
        if (error.value) throw new Error(error)
        toast.success(t(languageFilePrefix + '.updated'))
        await afterSubmit()
        await router.push({ path: useRouteParser().routeDottedToSlash(routePrefix) })
      } else {
        model.value.id = null
        const { data, pending, error, refresh } = await repository.create(formData, repositoryParams)
        if (error.value) throw new Error(error)
        toast.success(t(languageFilePrefix + '.created'))
        await afterSubmit()
        await router.push({ path: useRouteParser().routeDottedToSlash(routePrefix) })
      }
    } catch (e) {
      toast.error(t('global.error_occurred'))
      console.log(e)
    } finally {
      appStore.isLoading(false, false);
    }
  })

  return {
    getData,
    handleSubmit,
    setFieldValue,
    onSubmit,
  }
}
