<template>
  <router-link
    v-if="router.hasRoute(options.route)"
    :to="{ name: options.route, params: { category_tree: record.id } }"
  >
    <button
      class="btn btn-info btn-sm me-2"
      type="button"
      :title="options.name"
    >
      {{ options.name }}
    </button>
  </router-link>
</template>
<script lang="ts">
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Button',
  props: {
    options: Object,
    record: Object,
  },
  setup() {
    const router = useRouter()
    return { router }
  },
})
</script>
