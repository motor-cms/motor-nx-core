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
        {{ option.name || option.label }}
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
    name: String,
  },
  emits: ['submit'],
  setup(props, ctx) {
    const router = useRouter();
    const route = useRoute();

    const selected = ref('');

    watch(() => route.query, () => {
      selected.value = route.query[props.options.parameter] || ''
    }, { immediate: true })

    const submitFilter = () => {
      let routeQuery = {}
      routeQuery[props.options.parameter] = selected.value
      ctx.emit('submit', { parameter: props.options.parameter, value: selected.value })
    }
    return {
      selected,
      submitFilter
    }
  },
})
</script>
