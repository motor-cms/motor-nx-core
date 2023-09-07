<template>
  <NuxtLink
    :to="to"
  >
    <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;"><fa :icon="options.icon ?? 'pencil-alt'"></fa></a>
  </NuxtLink>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";

export default defineComponent({
  name: 'EditButton',
  props: {
    options: Object,
    record: Object,
  },
  setup(props) {
    const routeParser = useRouteParser();
    const to = routeParser.routeDottedToSlash(props.options.route) + '/' +  props.record.id
    return { to }
  },
})
</script>
