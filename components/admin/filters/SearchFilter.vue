<template>
  <div class="col-md-3">
    <input
      id="motor-grid-search"
      v-model="term"
      @blur="$emit('submit', { parameter: 'search', value: term })"
      @keyup.enter="$event.target.blur()"
      :placeholder="$t('global.press_enter_to_serach')"
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
  emits: ['submit']
})
</script>
