<template>
  <div
    class="d-block"
    style="width: 100%; min-height: 100%"
    :style="{ backgroundColor: record[prop] }"
  >
    &nbsp;
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  options: Object,
  record: Object,
  prop: String,
});
</script>
