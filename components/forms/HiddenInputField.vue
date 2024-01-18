<template>
    <input
      type="hidden"
      :id="id"
      :name="name"
      v-model="value"
    />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useField } from 'vee-validate'

export default defineComponent({
  name: 'HiddenInputField',
  props: {
    id: String,
    modelValue: {
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const {
      value,
      meta,
    } = useField(<string>props.name, undefined, {
      initialValue: <string>props.modelValue,
    })

    return {
      meta,
      value,
    }
  },
})
</script>
