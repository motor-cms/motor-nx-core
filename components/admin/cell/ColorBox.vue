<template>
  <div
    class="d-block"
    style="width: 100%; min-height: 100%"
    :style="{ backgroundColor: record[prop] }"
  >
    &nbsp;
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ColorBox',
  props: {
    options: Object,
    record: Object,
    prop: String,
  },
})
</script>
