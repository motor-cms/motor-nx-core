<template>
  <nav
    class="
      navbar navbar-main navbar-expand-lg
      motor-navbar-top
      px-0
      mx-4
      border-radius-xl
      shadow-none
    "
    id="navbarBlur"
    navbar-scroll="true"
  >
    <div class="container-fluid py-1 px-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
          <li class="breadcrumb-item text-sm">
            <a class="opacity-5 text-dark" href="javascript:;">Backend</a>
          </li>
          <li
            class="breadcrumb-item text-sm text-dark active"
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="index"
          >
            <router-link
              :to="{ name: breadcrumb.route }"
              v-if="index <= breadcrumbs.length && breadcrumb.route"
              >{{ $t(breadcrumb.name) }}</router-link
            >
            <span v-if="!breadcrumb.route">{{ $t(breadcrumb.name) }}</span>
          </li>
          <li
            v-if="!breadcrumbs.length"
            class="breadcrumb-item text-sm text-dark active"
            aria-current="page"
          >
            {{ title }}
          </li>
        </ol>
        <h6 class="font-weight-bolder mb-0">
          {{ title }}
        </h6>
      </nav>
      <div class="mt-sm-0 mt-2 me-md-0 me-sm-4" style="flex: auto" id="navbar">
        <ul class="ms-md-auto pe-md-3 d-flex navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center" v-if="user">
            <span class="nav-link text-body font-weight-bold px-0">
              <fa v-if="!user.avatar" icon="user" class="me-sm-1"></fa>
              <img
                v-if="user.avatar?.conversions?.preview"
                :src="user.avatar.conversions.preview"
                class="avatar avatar-sm me-3"
              />
              <span class="d-sm-inline d-none">{{ user.name }}</span>
            </span>
          </li>
          <li class="nav-item d-flex align-items-center" v-if="user">
            <fa
              @click="logout"
              icon="sign-out-alt"
              class="fixed-plugin-button-nav cursor-pointer ms-2"
            ></fa>
            <AdminModalLogout
              :active="active"
              @cancel="cancel"
              @confirm="confirm"
            />
          </li>
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              href="javascript:;"
              class="nav-link text-body p-0"
              id="iconNavbarSidenav"
            >
              <fa icon="bars"></fa>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import useAuth from 'motor-core/compositions/authentication/useAuth'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AdminModalLogout from './modal/Logout.vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'AdminHeader',
  components: { AdminModalLogout },
  setup() {
    const active = ref(false)

    const router = useRouter()

    const logout = () => {
      active.value = true
    }
    const confirm = () => {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.replace({ name: 'admin.login' })
    }

    const cancel = () => {
      active.value = false
    }

    const route = useRoute()

    const { t } = useI18n()

    const title = computed(() => {
      if (route.meta && route.meta.title) {
        return t(<string>route.meta.title)
      }
      return 'Dashboard'
    })

    const breadcrumbs = computed(() => {
      if (route.meta && route.meta.breadcrumbs) {
        return route.meta.breadcrumbs
      }
      return []
    })

    useAuth()

    const store = useStore()

    const user = computed(() => store.state.motor.user)

    return {
      user,
      title,
      breadcrumbs,
      confirm,
      cancel,
      logout,
      active,
      store,
    }
  },
})
</script>
