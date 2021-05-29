<template>
  <div class="col-md-3">
    <input
      id="motor-grid-search"
      v-model="term"
      @blur="$emit('submit', { parameter: 'search', value: term })"
      @keyup.enter="$event.target.blur()"
      placeholder="Press CMD + K to search"
      class="form-control form-control-alternative"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchFilter',
  data() {
    return {
      term: '',
    }
  },
  emits: ['submit'],
})
</script>
