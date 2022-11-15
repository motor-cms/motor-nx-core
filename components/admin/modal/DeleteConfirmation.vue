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
import { computed, defineComponent, reactive, watch } from 'vue'

export default defineComponent({
  name: 'DeleteConfirmation',
  props: {
    record: Object,
    active: Boolean,
  },
  emits: ['cancel', 'confirm'],
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
    const body = computed(() => {
      return props.record.name
    })

    watch(
      () => props.active,
      (newValue, oldValue) => {
        const modal = new Modal(
          document.getElementById('admin-modal-' + props.record.id),
          { keyboard: false, backdrop: 'static' }
        )

        if (newValue) {
          modal.show()
        } else {
          modal.hide()
        }
      }
    )

    return {
      ...data,
      cancel,
      confirm,
      body,
    }
  },
})
</script>
