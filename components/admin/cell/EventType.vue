<template>
  <span :style="{ backgroundColor: record.event_type.web_color }" class="badge">
    {{ record.event_type.name }}
  </span>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EventType',
  props: {
    options: Object,
    record: Object,
    prop: String,
  },
})
</script>
