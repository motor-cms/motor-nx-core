<template>
    <Teleport to="body">
      <div
        class="custommodal fade"
        :class="{show: active}"
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
                {{ $t('global.logout') }}
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
            <div class="modal-body">{{ $t('global.logout_question') }}</div>
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
                {{ $t('global.yes') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'

export default defineComponent({
  name: 'Logout',
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
