<template>
 <BaseModal @confirm="confirm" @cancel="cancel" :active="active" :accept-text="$t('global.yes')" :dismiss-text="$t('global.no')">
   <template #header>
     {{ $t('global.logout') }}
   </template>
   <template #body>
     {{ $t('global.logout_question') }}
   </template>
 </BaseModal>
</template>
<script setup lang="ts">
import BaseModal from "@zrm/motor-nx-core/components/admin/modal/BaseModal.vue";

const props = defineProps({
  active: Boolean,
});
const emit = defineEmits(['confirm', 'cancel']);
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
</script>
