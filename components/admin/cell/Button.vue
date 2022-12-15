<template>
  <router-link
    v-if="router.hasRoute(options.route)"
    :to="to"
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
  setup(props) {
    const to = { name: props.options.route, params: {}};
    // eslint-disable-next-line vue/no-setup-props-destructure
    to.params[props.options.property] = props.record.id;

    console.log(to);

    const router = useRouter()
    return { router, to }
  },
})
</script>
