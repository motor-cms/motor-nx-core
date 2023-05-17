<template>
  <fa icon="bell" @click="notificationCenterOpen = !notificationCenterOpen"></fa>
  <Popover v-if="notificationCenterOpen">
    <div class="alert alert-light alert-dismissible fade show" role="alert" v-for="notification in notifications">
      <span class="alert-icon"><i class="ni ni-like-2"></i></span>
      <span class="alert-text">{{ t(notification.message)}}</span>
      <button type="button" class="btn-close" data-bs-dismiss="alert" @click="notificationStore.removeNotification(notification)" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </Popover>
</template>
<script setup lang="ts">
import {useToast} from "vue-toastification";
import {useNotificationStore} from "~/packages/motor-nx-core/store/notification";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
import Popover from "~/packages/motor-nx-core/components/admin/cell/Popover.vue";
import {ref} from "vue";

const notificationStore = useNotificationStore();
const {latestNotification, notifications} = storeToRefs(notificationStore);
const {t} = useI18n();
const toast = useToast()
const notificationCenterOpen = ref(false);

watch(() => latestNotification.value, () => {
  if (!latestNotification.value) return;
  toast.info(t(latestNotification.value.message))
});

</script>
