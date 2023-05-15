import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useToast } from 'vue-toastification'
import Ref from '../types/model'
import {useAppStore} from "@zrm/motor-nx-core/store/app";
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
import {ObjectSchema, InferType} from "yup";

import { configure } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';
import de from '@vee-validate/i18n/dist/locale/de.json';
import fr from '@vee-validate/i18n/dist/locale/fr.json';
import { setLocale } from '@vee-validate/i18n';
import {storeToRefs} from "pinia";
import {useUserStore} from "~/packages/motor-nx-core/store/user";


export default function baseForm(
  languageFilePrefix: string,
  routePrefix: string,
  repository: any,
  model: Ref<{ [index: string]: any }>,
  schema: ObjectSchema<Record<any, any>>,
  sanitizer: (formData: object) => void = () => {},
  afterSubmit: (oldModel: Ref<Record<string, any>>, newModel: Ref<Record<string, any>>) => void = () => {},
  repositoryParams?: {},
) {
  // Load i18n module
  const { t } = useI18n()

  // Load router
  const router = useRouter()
  const route = useRoute();

  const toast = useToast()
  const appStore = useAppStore();

  type ModelType = InferType<typeof schema>;

  const fillModel = async (data: Partial<ModelType> | undefined | null) => {
    try {
      model.value = await schema.validate(data, {stripUnknown: true, strict: false});
    } catch (e) {
      console.log("Error while filling api response into model validation schema. Setting model to response data");
      model.value = data;
    }
  }

  // Get record from id and set values. Redirect back and show error if record was not found
  const getData = async () => {
    if (!route.params.id) return;
    const id: number = Number(route.params.id)
    console.log(repositoryParams);
    const {data: response} = await repository.get(id, repositoryParams)
    await fillModel(response.value.data);
  }

  localize({ de });
  setLocale('de')

  configure({
    generateMessage: localize('de'),
  });

  // Initialize form with default values and the validation schema
  const form = useForm({
    initialValues: model,
    validationSchema: schema,
  })

  const onSubmit = form.handleSubmit(async (values, {resetForm}) => {
    try {
      appStore.isLoading(true);
      const oldModel = ref(JSON.parse(JSON.stringify(model.value)));
      const formData = reactive<any>(JSON.parse(JSON.stringify(model.value)))
      delete formData.id;

      if (sanitizer !== null) {
        sanitizer(formData)
      }

      if (model.value.id) {
        const { data: response, pending, error, refresh } = await repository.update(
          formData,
          model.value.id,
          repositoryParams
        )
        if (error.value) throw new Error(error)
        await fillModel(response.value.data);
        await afterSubmit(oldModel, model)
        toast.success(t(languageFilePrefix + '.updated'))
        if (routePrefix && routePrefix.length) {
          await router.push({ path: useRouteParser().routeDottedToSlash(routePrefix) })
        }
      } else {
        model.value.id = null
        const { data: response, pending, error, refresh } = await repository.create(formData, repositoryParams)
        if (error.value) throw new Error(error)
        await fillModel(response.value.data);
        await afterSubmit(oldModel,model)
        toast.success(t(languageFilePrefix + '.created'))
        if (routePrefix && routePrefix.length) {
          await router.push({path: useRouteParser().routeDottedToSlash(routePrefix)})
        }
      }
    } catch (e) {
      toast.error(t('global.error_occurred'))
      console.error(e)
    } finally {
      appStore.isLoading(false);
      resetForm()
    }
  })

  const { user } = storeToRefs(useUserStore());

  watchEffect(() => {
    model.value.client_id = user.value.client_id;
  })

  return {
    getData,
    onSubmit,
    form,
    ...form,
  }
}
