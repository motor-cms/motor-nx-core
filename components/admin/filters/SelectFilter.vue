<template>
  <div class="col-md-3">
    <select
      v-model="selected"
      @change="submitFilter"
      class="form-control"
    >
      <option value="" v-if="options.emptyOption">
        {{ options.emptyOption }}
      </option>
      <option
        v-for="option in options.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SelectFilter',
  props: {
    options: Object,
  },
  emits: ['submit'],
  setup(props, ctx) {
    const selected = ref('');

    const router = useRouter();
    const route = useRoute();
    const submitFilter = () => {
      let routeQuery = {}
      routeQuery[props.options.parameter] = selected.value
      router.replace({query: Object.assign(route.query, routeQuery)});
      ctx.emit('submit', { parameter: props.options.parameter, value: selected.value })
    }
    return {
      selected,
      submitFilter
    }
  },
})
</script>
