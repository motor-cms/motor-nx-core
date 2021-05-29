<template>
  <div class="inline mb-0 ms-1">
    <button
      @click="askForConfirmation"
      class="btn btn-danger btn-sm align-content-end"
      type="button"
      :title="options.name"
    >
      <fa icon="trash-alt" />
    </button>
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DeleteButton',
  props: {
    options: Object,
    record: Object,
    resource: String,
  },
  components: { AdminModalDeleteConfirmation },
  emits: ['submit'],
  data() {
    return {
      active: false,
    }
  },
  methods: {
    askForConfirmation() {
      this.active = true
    },
    cancel() {
      this.active = false
    },
    confirm() {
      this.active = false
      this.$emit('submit', {
        component: 'DeleteButton',
        record: this.record.id,
        resource: this.resource,
      })
    },
  },
})
</script>
