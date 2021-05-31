<template>
  <div class="inline mb-0 ms-1">
    <div class="btn-group" role="group" aria-label="Basic example">
      <button
        @click="submit(true)"
        type="button"
        class="btn btn-sm"
        :class="{ 'btn-primary': record[options.prop] }"
      >
        {{ $t('global.yes') }}
      </button>
      <button
        @click="submit(false)"
        type="button"
        class="btn btn-sm"
        :class="{ 'btn-primary': !record[options.prop] }"
      >
        {{ $t('global.no') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BooleanToggle',
  props: {
    options: <any>Object,
    record: <any>Object,
    resource: String,
    index: Number,
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const submit = (value: boolean) => {
      if (value === props.record[props.options.prop]) {
        return
      }
      emit('submit', {
        component: 'UpdateRecord',
        record: props.record.id,
        property: props.options.prop,
        value: value,
        index: props.index,
      })
    }

    return { submit }
  },
})
</script>
