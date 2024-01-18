<template>
  <div class="position-relative">
<!--    <fa icon="bell" @click="notificationCenterOpen = !notificationCenterOpen" />-->
<!--    <Popover v-if="notificationCenterOpen">-->
<!--      <div class="alert alert-light alert-dismissible fade show m-0" role="alert" v-for="notification in notifications">-->
<!--        <span class="alert-icon"><i class="ni ni-like-2"></i></span>-->
<!--        <span class="alert-text">{{ t(notification.message)}}</span>-->
<!--        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="notificationStore.removeNotification(notification)" aria-label="Close">-->
<!--          <span aria-hidden="true">&times;</span>-->
<!--        </button>-->
<!--      </div>-->
<!--    </Popover>-->
  </div>
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
import {ref} from "vue";

const notificationStore = useNotificationStore();
const {latestNotification, notifications} = storeToRefs(notificationStore);
const {t} = useI18n();
const { $toast } = useNuxtApp()
const notificationCenterOpen = ref(false);

watch(() => latestNotification.value, () => {
  if (!latestNotification.value) return;
  $toast.info(t(latestNotification.value.message))
});

</script>
