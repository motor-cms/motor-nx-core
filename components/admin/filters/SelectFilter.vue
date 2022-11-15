<template>
  <div class="col-md-3">
    <select
      v-model="value"
      @change="$emit('submit', { parameter: options.parameter, value: value })"
      class="form-control"
    >
      <option value="" v-if="options.emptyOption">
        {{ options.emptyOption }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'SelectFilter',
  props: {
    options: Object,
  },
  emits: ['submit'],
  setup() {
    const data = reactive({
      value: '',
    })
    return {
      ...data,
    }
  },
})
</script>
