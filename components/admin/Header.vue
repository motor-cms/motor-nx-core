<template>
  <nav class="navbar motor-navbar-top navbar-main navbar-expand-lg px-0 mx-4 border-radius-xl position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky" id="navbarBlur" navbar-scroll="true">
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
            <NuxtLink
              :to="{ name: breadcrumb.route }"
              v-if="index <= breadcrumbs.length && breadcrumb.route"
              >{{ $t(breadcrumb.name) }}</NuxtLink
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
          <li class="nav-item d-flex align-items-center mx-6" ref="navbarSlot" />
          <li class="nav-item d-flex align-items-center" v-if="user">
            <span class="nav-link text-body font-weight-bold px-0">
              <fa v-if="!user.avatar" icon="user" class="me-sm-1" />
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
            />
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
              @click="toggleNavbar"
            >
              <fa icon="bars" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AdminModalLogout from './modal/Logout.vue'
import { useUserStore } from '@zrm/motor-nx-core/store/user';
import {useTeleport} from "@zrm/motor-nx-core/composables/ui/teleport";
import {useAppStore} from "@zrm/motor-nx-core/store/app";
import {storeToRefs} from "pinia";


export default defineComponent({
  name: 'AdminHeader',
  components: { AdminModalLogout },
  methods: {
    toggleNavbar() {
      document.querySelector('aside').classList.toggle('open');
    }
  },
  setup() {
    const userStore = useUserStore()
    const { removeUser } = userStore
    const { navbarSlot } = useTeleport();
    const active = ref(false)
    const appStore = useAppStore();
    const { updatingInBackground } = storeToRefs(appStore)

    const router = useRouter()

    const logout = () => {
      active.value = true
    }

    const confirm = () => {
      userStore.removeUser()
      router.replace({ name: '/admin/login' })
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

    return {
      title,
      breadcrumbs,
      confirm,
      cancel,
      logout,
      active,
      ...userStore,
      navbarSlot,
      updatingInBackground
    }
  },
})
</script>
