<template>
  <div class="form-group" :class="{ 'has-danger': errorMessage }">
    <label :for="id">
      {{ label }}
    </label>
    <Multiselect :object="object" v-model="inputValue" :options="options" :searchable="true" />
    <p class="text-danger" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { useField } from 'vee-validate'
import { defineComponent } from 'vue'
import Multiselect from '@vueform/multiselect'

export default defineComponent({
  name: 'Select2Field',
  components: { Multiselect },
  props: {
    id: String,
    modelValue: {
      required: true,
    },
    object: {
      default: false
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    options: Array,
  },
  setup(props) {
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(<string>props.name, undefined, {
      initialValue: props.modelValue,
    })

    return {
      handleChange,
      handleBlur,
      errorMessage,
      inputValue,
      meta,
    }
  },
})
</script>
