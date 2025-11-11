<template>
  <NuxtLink
    :to="to"
    :data-tooltip="tooltipText"
  >
    <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;"><fa :icon="options.icon ?? 'pencil-alt'"></fa></a>
  </NuxtLink>
</template>
<script setup lang="ts">
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  options: Object,
  record: Object,
});

// Translate the tooltip text reactively (Martin Henrichs - 07.Nov.2025)
const tooltipText = computed(() => {
  if (!props.options?.name) return ''
  return t(props.options.name)
});

const routeParser = useRouteParser();
const to = routeParser.routeDottedToSlash(props.options.route) + '/' +  props.record.id;
</script>
