<template>
  <NuxtLink
    :to="to"
  >
    <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;"><fa :icon="options.icon ?? 'pencil-alt'"></fa></a>
  </NuxtLink>
</template>
<script setup lang="ts">
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
const props = defineProps({
  options: Object,
  record: Object,
});
const routeParser = useRouteParser();
const to = routeParser.routeDottedToSlash(props.options.route) + '/' +  props.record.id;
</script>
