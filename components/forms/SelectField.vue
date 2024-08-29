<template>
  <div class="form-group" :id="id" :class="{ 'has-danger': errorMessage }">
    <label :for="id">
      {{ label }}
    </label>
    <AdminTooltip
      v-if="description.length"
      :text="description"
      type="info"
      :style="{ 'margin-left': '5px' }"
    ></AdminTooltip>
    <Multiselect
      :disabled="loading || disabled"
      :id="id"
      :canClear="is_nullable"
      :can-deselect="is_nullable"
      :object="object"
      :mode="mode"
      v-model="inputValue"
      :value="inputValue"
      :options="parsedOptions"
      :searchable="searchable"
    />
    <p class="text-danger" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { useField } from 'vee-validate'
import { defineComponent } from 'vue'
import Multiselect from '@vueform/multiselect'
import {storeToRefs} from "pinia";

const model = defineModel();
const props = defineProps({
  id: String,
  disabled: {
    type: Boolean,
    default: false,
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
  options: Array<{label: String, value: String|Number}>,
  mode: {
    type: String,
    default: 'single'
  },
  description: {
    type: String,
    default: '',
  },
});
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(<string>props.name, undefined, {
  initialValue: model.value,
  syncVModel: true,
})


const { loading } = storeToRefs(useAppStore())
const parsedOptions = computed(() => {
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

</script>

<style scoped lang="scss">
.form-group {
  label {
    &:empty {
      display: none;
    }
  }
}
</style>
