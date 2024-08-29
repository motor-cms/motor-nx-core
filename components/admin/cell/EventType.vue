<template>
  <span :style="{ backgroundColor: record.event_type.web_color }" class="badge">
    {{ record.event_type.name }}
  </span>
</template>
<script setup lang="ts">
const props = defineProps({
  options: Object,
  record: Object,
  prop: String,
});
</script>
