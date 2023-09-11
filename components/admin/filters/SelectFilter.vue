<template>
  <div class="col-md-3">
    <select
      v-model="value"
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
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'SelectFilter',
  props: {
    options: Object,
  },
  emits: ['submit'],
  setup(props, ctx) {
    const data = reactive({
      value: '',
    })

    const router = useRouter();
    const route = useRoute();
    const submitFilter = () => {
      let routeQuery = {}
      routeQuery[props.options.parameter] = data.value
      console.log(routeQuery)
      router.replace({query: Object.assign(route.query, routeQuery)});
      ctx.emit('submit', { parameter: props.options.parameter, value: data.value })
    }
    return {
      ...data,
      submitFilter
    }
  },
})
</script>
