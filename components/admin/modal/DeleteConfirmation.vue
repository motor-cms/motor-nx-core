<template>
  <div
    class="modal fade"
    :id="'admin-modal-' + record.id"
    tabindex="-1"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ $t('global.really_delete') }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          {{ body }}
        </div>
        <div class="modal-footer">
          <button
            v-on:click="cancel"
            type="button"
            class="btn bg-gradient-secondary"
            data-bs-dismiss="modal"
          >
            {{ $t('global.no') }}
          </button>
          <button
            v-on:click="confirm"
            type="button"
            class="btn bg-gradient-primary"
            data-bs-dismiss="modal"
          >
            {{ $t('global.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Modal } from 'bootstrap'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DeleteConfirmation',
  props: {
    record: Object,
    active: Boolean,
  },
  watch: {
    active(newValue) {
      const modal = new Modal(
        document.getElementById('admin-modal-' + this.record.id),
        { keyboard: false, backdrop: 'static' }
      )

      if (newValue) {
        modal.show()
      } else {
        modal.hide()
      }
    },
  },
  computed: {
    body(): string {
      return this.record.name
    },
  },
  emits: ['cancel', 'confirm'],
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
    cancel() {
      this.showModal = false
      this.$emit('cancel')
    },
    confirm() {
      this.showModal = false
      this.$emit('confirm')
    },
  },
})
</script>
