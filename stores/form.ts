import { defineStore } from 'pinia'
import {toTypedSchema} from "@vee-validate/yup";
import * as yup from "yup";
import {Ref} from "@vue/reactivity";
import {InferType} from "yup";

export const useFormStore = defineStore('form', () => {

    const model = ref({});
    const formData = ref({});
    const formSchema = ref({});
    const form = ref({});

    const schema = computed(() => toTypedSchema(yup.object({
        ...formSchema.value
    })))

    const init = (initialModelData: Record<string, any>, initialFormFata: Record<string, any>) => {
        formData.value = JSON.parse(JSON.stringify(initialFormFata));
        model.value = Object.assign({}, JSON.parse(JSON.stringify(initialModelData)), JSON.parse(JSON.stringify(initialFormFata)));
    }

    type ModelType = InferType<typeof schema>;

    const fillModel = async (data: Partial<ModelType> | undefined | null) => {
        model.value = data;
    }

    watch(() => model.value, () => {
        formData.value = Object.assign(...Object.keys(formData.value).map(k => ({[k] : model.value[k]})));
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
