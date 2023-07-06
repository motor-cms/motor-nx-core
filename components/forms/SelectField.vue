<template>
  <div class="form-group" :id="id" :class="{ 'has-danger': errorMessage }">
    <label :for="id">
      {{ label }}
    </label>
    <Multiselect :disabled="loading" :id="id" :canClear="is_nullable" :can-deselect="is_nullable" :object="object" :mode="mode" v-model="inputValue" :options="parsedOptions" :searchable="searchable" />
    <p class="text-danger" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { useField } from 'vee-validate'
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
    is_nullable: {
      default: true
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    options: Array,
    mode: {
      type: String,
      default: 'single'
    }
  },
  setup(props, ctx) {
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(<string>props.name, undefined, {
      initialValue: props.modelValue,
      syncVModel: true,
    })

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

    return {
      handleChange,
      handleBlur,
      errorMessage,
      inputValue,
      meta,
      parsedOptions,
      loading
    }
  },
})
</script>
