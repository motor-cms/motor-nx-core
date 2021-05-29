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
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StaticField',

  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    emptyValue: String,
  },
})
</script>
