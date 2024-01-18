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

<script lang="ts">
// import { Modal } from 'bootstrap'
import { computed, defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from "@zrm/motor-nx-core/components/admin/modal/BaseModal.vue";

export default defineComponent({
  name: 'DeleteConfirmation',
  components: {BaseModal},
  props: {
    record: Object,
    active: Boolean,
  },
  emits: ['cancel', 'confirm'],
  setup(props, ctx) {

    // Load i18n module
    const { t } = useI18n()

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
    const body = computed(() => {
      return props.record.name
    })

    return {
      ...data,
      cancel,
      confirm,
      body,
    }
  },
})
</script>
