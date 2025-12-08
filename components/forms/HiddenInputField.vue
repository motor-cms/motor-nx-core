<template>
    <input
      :id="id"
      v-model="value"
      type="hidden"
      :name="name"
    />
</template>
<script setup lang="ts">
import { useField } from 'vee-validate';

const props = defineProps({
  id: String,
  modelValue: {
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
});
const {
  value,
  meta,
} = useField(<string>props.name, undefined, {
  initialValue: <string>props.modelValue,
});
</script>
