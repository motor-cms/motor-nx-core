<template>
  <template v-if="record?.[prop]">
    <fa icon="check" class="text-success"/>
  </template>
  <template v-else>
    <fa icon="xmark"/>
  </template>
</template>
<script setup lang="ts">
const props = defineProps({
  options: Object,
  record: Object,
  prop: String,
});
</script>
