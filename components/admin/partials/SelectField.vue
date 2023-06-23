<template>
  <Multiselect :disabled="loading" :id="id" :object="object" :mode="mode" v-model="inputValue" :options="parsedOptions" :searchable="true" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Multiselect from '@vueform/multiselect'
import {storeToRefs} from "pinia";
import {useAppStore} from "~/packages/motor-nx-core/store/app";

export default defineComponent({
  name: 'SelectField',
  components: { Multiselect },
  emits: ['update:modelValue'],
  props: {
    id: String,
    modelValue: {
      type: Array,
      required: true
    },
    object: {
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    options: Array,
    mode: {
      type: String,
      default: 'single'
    }
  },
  setup(props, ctx) {

    const inputValue = ref(props.modelValue);

    const { loading } = storeToRefs(useAppStore())
    const parsedOptions = computed(() => {
      console.log("options ARE", props.options);
      return props.options?.map(option => {
        if (typeof option === 'string') {
          return {label: option, value: option}
        }
        if (typeof option === 'object') {
          if ('name' in option) {
            return Object.assign( option,{label: option.name});
          }
          return option;
        }
      });
    });

    watchEffect(() => {
      ctx.emit('update:modelValue', inputValue.value)
    })

    return {
      parsedOptions,
      loading,
      inputValue
    }
  },
})
</script>