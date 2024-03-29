import { computed } from 'vue'
import usePermission from './permission'
import useRole from './role'
import { storeToRefs } from 'pinia'

export default function useRolesAndPermissions() {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const userPermissions = computed(() => {
    if (!user.value) {
      return []
    }
    return user.value.permissions
  })

  const userRoles = computed(() => {
    if (!user.value) {
      return []
    }
    return user.value.roles
  })

  return {
    ...usePermission(userPermissions, userRoles),
    ...useRole(userRoles),
  }
}
