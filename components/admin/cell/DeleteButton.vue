<template>
  <div class="inline mb-0 ms-1" :data-tooltip="tooltipText">
    <a @click="askForConfirmation" class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;"><fa icon="trash-alt"></fa></a>

    <AdminModalDeleteConfirmation
      :active="active"
      :record="record"
      @cancel="cancel"
      @confirm="confirm"
    />
  </div>
</template>
<script setup lang="ts">
import AdminModalDeleteConfirmation from '../modal/DeleteConfirmation.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  options: Object,
  record: Object,
  resource: String,
});
const emit = defineEmits(['submit']);

// Translate the tooltip text reactively (Martin Henrichs - 07.Nov.2025)
const tooltipText = computed(() => {
  if (!props.options?.name) return ''
  return t(props.options.name)
});
const active = ref(false)
const askForConfirmation = () => {
  active.value = true
}
const cancel = () => {
  active.value = false
}
const confirm = () => {
  active.value = false
  emit('submit', {
    component: 'DeleteButton',
    record: props.record.id,
    resource: props.resource,
  })
}
</script>
