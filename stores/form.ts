import {defineStore} from 'pinia'
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {Ref} from "@vue/reactivity";
import {InferType} from "yup";

export const useFormStore = defineStore('form', () => {

  const model = ref<Record<string, any>>({});
  const formData = ref<Record<string, any>>({});
  const formSchema = ref({});
  const form = ref({});

  /**
   * Computed schema, if formSchema changes, the schema will be updated and schema in useForm (baseForm.ts) will be updated
   */
  const schema = computed(() => toTypedSchema(yup.object({
    ...formSchema.value
  })))

  /**
   * Initialize form with default values and the validation schema
   * @param initialModelData
   * @param initialFormFata
   */
  const init = (initialModelData: Record<string, any>, initialFormFata: Record<string, any>) => {
    formData.value = JSON.parse(JSON.stringify(initialFormFata));
    model.value = Object.assign({}, JSON.parse(JSON.stringify(initialModelData)), JSON.parse(JSON.stringify(initialFormFata)));
  }


  /**
   * Fill model with data, only keys that are in model will be filled
   * @param data
   */
  const fillModel = async (data: Record<string, any> | undefined | null) => {
    model.value = Object.assign(...Object.keys(model.value).map(k => ({[k]: data[k]})));
  }

  /**
   * Watch model and update formData
   */
  watch(() => model.value, () => {
    formData.value = Object.assign(...Object.keys(formData.value).map(k => ({[k]: model.value[k]})));
  }, {deep: true})

  return {
    model,
    schema,
    formSchema,
    fillModel,
    init,
    formData,
    form
  }
})
