<template>
  <BaseModal @confirm="confirm" @cancel="cancel" :active="active" :accept-text="$t('global.do_delete')" :dismiss-text="$t('global.no')">
    <template #header>
      {{ $t('global.really_delete') }}
    </template>
    <template #body>
      {{ body }}
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseModal from "@zrm/motor-nx-core/components/admin/modal/BaseModal.vue";

const props = defineProps({
  record: Object,
  active: Boolean,
});
const emit = defineEmits(['cancel', 'confirm']);

// Load i18n module
const { t } = useI18n()

const data = reactive({
  showModal: false,
})
const cancel = () => {
  data.showModal = false
  emit('cancel')
}
const confirm = () => {
  data.showModal = false
  emit('confirm')
}
const body = computed(() => {
  return props.record.name
})
</script>
