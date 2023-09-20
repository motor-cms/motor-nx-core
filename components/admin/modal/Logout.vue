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
<script lang="ts">
import {computed, defineComponent, reactive, watch} from 'vue'
import BaseModal from "@zrm/motor-nx-core/components/admin/modal/BaseModal.vue";

export default defineComponent({
  name: 'Logout',
  components: {BaseModal},
  props: {
    active: Boolean,
  },
  emits: ['confirm', 'cancel'],
  setup(props, ctx) {
    const data = reactive({
      showModal: false,
    })
    const cancel = () => {
      data.showModal = false
      ctx.emit('cancel')
    }
    const confirm = () => {
      data.showModal = false
      ctx.emit('confirm')
    }

    return {
      ...data,
      cancel,
      confirm,
    }
  },
})
</script>
