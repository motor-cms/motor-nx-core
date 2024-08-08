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
                <span>&times;</span>
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

<script setup lang="ts">
const props = defineProps({
  acceptText: String,
  dismissText: String,
  active: Boolean,
});
const emit = defineEmits(['confirm', 'cancel']);
const data = reactive({
  showModal: false,
})
const cancel = () => {
  data.showModal = false
  emit('cancel')
};
const confirm = () => {
  data.showModal = false
  emit('confirm')
};
</script>
<style scoped>
.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
