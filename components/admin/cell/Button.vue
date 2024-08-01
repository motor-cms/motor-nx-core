<template>
  <NuxtLink
    :to="to"
  >
    <button
      class="btn btn-primary btn-sm me-2"
      type="button"
      :title="options.name"
    >
      {{ options.name }}
    </button>
  </NuxtLink>
</template>
<script setup lang="ts">
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";

const props = defineProps({
  options: Object,
  record: Object,
});
const routeParser = useRouteParser();
const to = routeParser.routeDottedToSlash(props.options.route) + '/' +  props.record.id + '/' + props.options.property;
</script>
