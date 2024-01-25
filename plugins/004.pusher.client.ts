import useSocket from "@zrm/motor-nx-core/composables/event/socket";

import {watch} from "vue";



export default defineNuxtPlugin(async (nuxtApp) => {

  // const userStore = useUserStore();
  // const notificationStore = useNotificationStore();
  // const socket = useSocket();
  //
  // watch(() => userStore.user, async () => {
  //   await socket.initialize();
  //   await socket.client.value.subscribe('private-user.' + userStore.user.id).bind(socket.events.export.created, async (data: Record<string, any>) => {
  //     notificationStore.publish(data);
  //   });
  // })

})
