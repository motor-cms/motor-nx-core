<template>
  <div class="form-group">
    <label>
      {{ label }}
    </label>
    <p>
      {{ value || emptyValue }}
    </p>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  emptyValue: String,
});
</script>
