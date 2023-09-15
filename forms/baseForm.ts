import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useToast } from 'vue-toastification'
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
import { ObjectSchema, InferType } from "yup";
import { configure } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';
import de from '@vee-validate/i18n/dist/locale/de.json';
import fr from '@vee-validate/i18n/dist/locale/fr.json';
import { setLocale } from '@vee-validate/i18n';
import { storeToRefs } from "pinia";

export default function baseForm(
  languageFilePrefix: string,
  routePrefix: string,
  repository: any,
  sanitizer: (formData: object) => void = () => { },
  afterSubmit: (oldModel: Ref<Record<string, any>>, newModel: Ref<Record<string, any>>) => void = () => { },
  repositoryParams?: {},
) {
  // Load i18n module
  const { t } = useI18n()

  // Load router
  const router = useRouter()
  const route = useRoute();

  const formStore = useFormStore();
  const {model, schema, form, formData} = storeToRefs(formStore);
  const toast = useToast()
  const appStore = useAppStore();

  // Get record from id and set values. Redirect back and show error if record was not found
  const getData = async () => {
    if (!route.params.id) return;
    const id: number = Number(route.params.id)
    const { data: response, error } = await repository.get(id, repositoryParams)
    if (error.value) {
      throw createError(error.value)
    }
    await formStore.fillModel(response.value.data);
  }

  localize({ de });
  setLocale('de')

  configure({
    generateMessage: localize('de'),
  });

  // Initialize form with default values and the validation schema
  form.value = useForm({
    initialValues: formStore.formData,
    validationSchema: formStore.schema,
  })

  form.value = useForm({
    initialValues: formData,
    validationSchema: schema,
  })

  const onSubmit = form.value.handleSubmit(async (values, { resetForm }) => {
    try {
      console.log("submitting form", values)
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
        await formStore.fillModel(response.value.data);
        await afterSubmit(oldModel, model)
        toast.success(t(languageFilePrefix + '.updated'))
        if (routePrefix && routePrefix.length) {
          await router.push({ path: useRouteParser().routeDottedToSlash(routePrefix) })
        }
      } else {
        model.value.id = null
        const { data: response, pending, error, refresh } = await repository.create(formData, repositoryParams)
        if (error.value) throw new Error(error)
        await formStore.fillModel(response.value.data);
        await afterSubmit(oldModel, model)
        toast.success(t(languageFilePrefix + '.created'))
        if (routePrefix && routePrefix.length) {
          await router.push({ path: useRouteParser().routeDottedToSlash(routePrefix) })
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

  watch(() => user.value.client_id, () => {
    model.value.client_id = user.value.client_id;
  }, { immediate: true });

  return {
    getData,
    onSubmit,
    form,
    fillModel: formStore.fillModel,
    ...form,
  }
}
