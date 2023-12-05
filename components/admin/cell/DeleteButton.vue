<template>
  <div class="inline mb-0 ms-1">
    <a @click="askForConfirmation" class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;"><fa icon="trash-alt"></fa></a>

    <AdminModalDeleteConfirmation
      :active="active"
      :record="record"
      @cancel="cancel"
      @confirm="confirm"
    />
  </div>
</template>
<script lang="ts">
import AdminModalDeleteConfirmation from '../modal/DeleteConfirmation.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DeleteButton',
  props: {
    options: Object,
    record: Object,
    resource: String,
  },
  components: { AdminModalDeleteConfirmation },
  emits: ['submit'],
  setup(props, ctx) {
    const active = ref(false)
    const askForConfirmation = () => {
      active.value = true
    }
    const cancel = () => {
      active.value = false
    }
    const confirm = () => {
      active.value = false
      ctx.emit('submit', {
        component: 'DeleteButton',
        record: props.record.id,
        resource: props.resource,
      })
    }

    return {
      active,
      askForConfirmation,
      cancel,
      confirm,
    }
  },
})
</script>
