<template>
  <NuxtLink
    :to="to"
  >
    <button
      class="btn btn-info btn-sm me-2"
      type="button"
      :title="options.name"
    >
      {{ options.name }}
    </button>
  </NuxtLink>
</template>
<script lang="ts">
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
import useRouteParser from "~/packages/motor-nx-core/composables/route/parse";

export default defineComponent({
  name: 'Button',
  props: {
    options: Object,
    record: Object,
  },
  setup(props) {
    const routeParser = useRouteParser();
    const to = routeParser.routeDottedToSlash(props.options.route) + '/' +  props.record.id + '/' + props.options.property;
    return { to }
  }
})
</script>
