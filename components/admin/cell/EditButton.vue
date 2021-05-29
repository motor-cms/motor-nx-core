<template>
  <router-link
    v-if="router.hasRoute(options.route)"
    :to="{ name: options.route, params: { id: record.id } }"
  >
    <button class="btn btn-info btn-sm" type="button" :title="options.name">
      <fa icon="edit" />
    </button>
  </router-link>
</template>
<script lang="ts">
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditButton',
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
