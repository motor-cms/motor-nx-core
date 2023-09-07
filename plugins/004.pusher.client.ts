import useSocket from "~/packages/motor-nx-core/composables/event/socket";
import {useUserStore} from "~/packages/motor-nx-core/store/user";
import {watch} from "vue";
import {useNotificationStore} from "~/packages/motor-nx-core/store/notification";


export default defineNuxtPlugin(async (nuxtApp) => {


  const userStore = useUserStore();
  const notificationStore = useNotificationStore();
  const socket = useSocket();

  watch(() => userStore.user, async () => {
    await socket.initialize();
    await socket.client.value.subscribe('private-user.' + userStore.user.id).bind(socket.events.export.created, async (data: Record<string, any>) => {
      notificationStore.publish(data);
    });
  })

})
