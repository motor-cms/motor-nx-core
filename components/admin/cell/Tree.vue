<template>
  <div :style="'padding-left: ' + (record.level - 1) * 30 + 'px'">
    {{ record[prop] }}
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  prop: String,
  record: Object,
});
</script>
