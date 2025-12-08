<template>
  <div class="inline mb-0 ms-1">
    <div class="btn-group" role="group" aria-label="Basic example">
      <button
        type="button"
        class="btn btn-sm"
        :class="{ 'btn-primary': record[options.prop] }"
        @click="submit(true)"
      >
        {{ $t('global.yes') }}
      </button>
      <button
        type="button"
        class="btn btn-sm"
        :class="{ 'btn-primary': !record[options.prop] }"
        @click="submit(false)"
      >
        {{ $t('global.no') }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  options: <any>Object,
  record: <any>Object,
  resource: String,
  index: Number,
});;
const emit = defineEmits(['submit']);;
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
</script>
