import {defineStore} from 'pinia'

interface EventNotification {
  message: string,
  id: number
}
export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Array<EventNotification>>([]);
  const latestNotification = ref<EventNotification>();
  const publish = (notification: EventNotification) => {
    notifications.value.push(notification);
    latestNotification.value = notification;
  }

  const removeNotification = (notification: EventNotification) => {
     notifications.value = notifications.value.filter(notification => notification.id !== notification.id)
  }

  return {
    notifications,
    latestNotification,
    removeNotification,
    publish
  }
})
