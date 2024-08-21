<template>
  <nav
    class="navbar motor-navbar-top navbar-main navbar-expand-lg px-0 mx-4 border-radius-xl position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky"
    id="navbarBlur" navbar-scroll="true">
    <div class="container-fluid py-1 px-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
          <li class="breadcrumb-item text-sm">
            <a class="opacity-5 text-dark" href="/">Backend</a>
          </li>
          <li
            class="breadcrumb-item text-sm text-dark active"
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="index"
          >
            <NuxtLink
              :to="{ name: breadcrumb.route }"
              v-if="index < breadcrumbs.length - 1 && breadcrumb.route"
            >{{ $t(breadcrumb.name) }}
            </NuxtLink
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
          {{ breadcrumbs.length? $t(breadcrumbs[breadcrumbs.length - 1].name) : title }}
        </h6>
      </nav>
      <div class="mt-sm-0 mt-2 me-md-0 me-sm-4" style="flex: auto" id="navbar">
        <ul class="ms-md-auto pe-md-3 d-flex navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center mx-3 mx-xxl-5" ref="navbarSlot">
            <EventNotificationHub/>
          </li>
          <li class="nav-item d-flex align-items-center mx-3 mx-xxl-5 w-25" v-if="hasRole('SuperAdmin')">
            <ClientSwitch/>
          </li>
          <li class="nav-item d-flex align-items-center" v-if="authenticated">
            <span class="nav-link text-body font-weight-bold px-0">
              <fa v-if="!user.avatar" icon="user" class="me-sm-1"/>
              <img
                v-if="user.avatar?.conversions?.preview"
                :src="user.avatar.conversions.preview"
                class="avatar avatar-sm me-3"
              />
              <span class="d-sm-inline d-none">{{ user.name }}</span>
            </span>
          </li>
          <li class="nav-item d-flex align-items-center" v-if="authenticated">
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
          <li class="nav-item d-xl-none p-3 d-flex align-items-center" @click="toggleNavbar">
            <a
              class="nav-link text-body p-0"
              id="iconNavbarSidenav"
            >
              <fa icon="bars" v-if="!sidebarOpen"/>
              <fa icon="close" v-else />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import {computed, defineComponent, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import AdminModalLogout from './modal/Logout.vue'
import ClientSwitch from '@zrm/motor-nx-admin/components/ClientSwitch.vue'
import {useTeleport} from "@zrm/motor-nx-core/composables/ui/teleport";

import {storeToRefs} from "pinia";
import useRolesAndPermissions from "@zrm/motor-nx-core/composables/auth/rolesAndPermissions";
import Popover from "@zrm/motor-nx-core/components/admin/cell/Popover.vue";
import EventNotificationHub from "@zrm/motor-nx-core/components/admin/partials/EventNotificationHub.vue";


export default defineComponent({
  name: 'AdminHeader',
  components: {EventNotificationHub, Popover, AdminModalLogout, ClientSwitch},
  setup() {
    const userStore = useUserStore()
    const {navbarSlot} = useTeleport();
    const active = ref(false)
    const appStore = useAppStore();
    const {hasRole} = useRolesAndPermissions();

    const router = useRouter()

    const logout = () => {
      active.value = !active.value
    }

    const confirm = async () => {
      await navigateTo('/');
      userStore.removeUser();
    }

    const cancel = () => {
      active.value = false
    }

    const route = useRoute()

    const {t, te} = useI18n()

    const title = computed(() => {
      if (route.meta && route.meta.title) {
        return t(<string>route.meta.title)
      }
      return 'Dashboard'
    })

    /*
    * Breadcrumb translations are to be provided in a specific format. Here are
    * some examples:
    * the breadcrumb name for /admin/motor-admin/email-templates is provided
    * at motor-admin.email_templates.email_templates
    * the breadcrumb name for /admin/motor-admin/email-templates/create is
    * provided at motor-admin.email_templates.create
    * The last part of the path can be duplicated but doesn't have to.
    * The last part of the path should have all hyphons replaced with underscores
    * Other parts of the path can have their hyphons replaced.
    * Variables are removed from the path, e.g the name for
    * /admin/motor-admin/email-templates/edit/1234 is found at
    * motor-admin.email_templates.edit
    */
    const breadcrumbs = computed(() => {
      if (route.meta && route.meta.breadcrumbs) {
        return route.meta.breadcrumbs
      }
      let path = '';
      const breadcrumbs = route.path.substring(1).split('/').flatMap((item, index, array) => {
        const crumb = {};
        path = `${path}/${item}`;
        let route = router.resolve(path);
        if (route.matched.length) {
          let path = route.matched[0].path
            .substring(1)
            .replace(/:(.*?)\(\)/g, '')
            .split('/')
            .filter(a => a != "");
          path.splice(0,1); //remove admin prefix
          for (let i = 1; i <= path.length; ++i) {
            path[path.length - i] = path[path.length - i].replaceAll('-', '_');
            name = path.reduce((a, b) => a + '.' + b);
            if (te(name + '.' + path.at(-1))) {
              name = name + '.' + path.at(-1);
              break;
            } else if (te(name)) {
              break;
            }
          }
          if(!te(name)) {
            name = path.at(-1);
            if(te('global.' + name)) {
              name = 'global.' + name;
            }
          }
          crumb.name = name;
          crumb.route = route.name;
          return crumb;
        } else {
          return [];
        }
      });
      return breadcrumbs;
    })

    const toggleNavbar = () => {
      appStore.toggleSidebar();
    }

    return {
      title,
      breadcrumbs,
      confirm,
      cancel,
      logout,
      active,
      ...storeToRefs(userStore),
      ...storeToRefs(appStore),
      navbarSlot,
      hasRole,
      toggleNavbar
    }
  },
})
</script>
