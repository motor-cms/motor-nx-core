<template>
  <Teleport to="body">
    <Transition name="customfade">
      <div
        v-if="active"
        class="modal"
        id="admin-modal-logout"
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
                <slot name="header"/>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                v-on:click="cancel"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <slot name="body"/>
            </div>
            <div class="modal-footer">
              <button
                v-on:click="cancel"
                type="button"
                class="btn bg-gradient-secondary"
                data-bs-dismiss="modal"
              >
                {{ dismissText }}
              </button>
              <button
                v-on:click="confirm"
                type="button"
                class="btn bg-gradient-primary"
                data-bs-dismiss="modal"
              >
                {{ acceptText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue'

export default defineComponent({
  name: 'BaseModal',
  props: {
    acceptText: String,
    dismissText: String,
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
<style scoped>
.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
