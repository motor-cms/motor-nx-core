<template>
  <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3" id="sidenav-main">
    <div class="sidenav-header">
      <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
      <NuxtLink to="/admin/dashboard" class="d-flex navbar-brand m-0">
        <img
          src="~/assets/images/logo.png"
          class="navbar-brand-img"
          :alt="$t('global.logo.alt')"
        />
        <span v-if="showProjectName" class="ms-1 font-weight-bold">{{ $t('global.project') }}</span>
      </NuxtLink>
    </div>
    <hr class="horizontal dark mt-0" />
    <div class="collapse navbar-collapse w-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <template v-if="loading && !navigationItems.length">
          <li class="nav-item" v-for="index in 5" :key="index">
            <div
              class="nav-link"
            >
              <div
                class="
                icon icon-shape icon-sm
                shadow
                border-radius-md
                bg-white
                text-center
                me-2
                d-flex
                align-items-center
                justify-content-center
              "
              >
              </div>
              <Skeletor
                class="nav-link-text ms-1"
                height="30"
                :width="Math.random() * 20 + 80 + '%'"
              />
            </div>
          </li>
        </template>
        <template v-else>
          <li class="nav-item" v-for="item in navigationItems" :key="item.name">
            <NuxtLink
              @click="toggleMenu(item.slug)"
              v-if="item.route"
              class="nav-link"
              :to="routeParser.routeDottedToSlash(item.route)"
              :class="{active: activeParent && activeParent ===item.slug || !activeParent && item.slug === 'dashboard' }"
            >
              <div
                class="
                icon icon-shape icon-sm
                shadow
                border-radius-md
                bg-white
                text-center
                me-2
                d-flex
                align-items-center
                justify-content-center
              "
              >
                <fa :icon="item.icon"/>
              </div>
              <span class="nav-link-text ms-1">{{ $t(item.name) }}</span>
            </NuxtLink>
            <a
              @click="toggleMenu(routeParser.routeDottedToSlash(item.slug, false))"
              v-else
              class="nav-link menu-dropdown"
              :class="[{active: activeParent === routeParser.routeDottedToSlash(item.slug, false)}, 'menu-' + item.slug]"
            >
              <div
                class="
                icon icon-shape icon-sm
                shadow
                border-radius-md
                bg-white
                text-center
                me-2
                d-flex
                align-items-center
                justify-content-center
              "
              >
                <fa :icon="item.icon" />
              </div>
              <span class="nav-link-text ms-1">{{ $t(item.name) }}</span>
            </a>
            <ul
              v-if="item.items"
              :class="[{open: activeParent === item.slug}, 'menu-' + item.slug + '-items']"
              class="navbar-nav sidebar-dropdown"
            >
              <li
                v-for="child in item.items"
                :key="child.slug"
                class="nav-item ps-5"
                @click="setActiveChild(child.slug)"
              >
                <NuxtLink
                  :to="routeParser.routeDottedToSlash(child.route)"
                  class="nav-link"
                  :class="[{active: activeChild === child.slug}, 'route-' + child.route.replace(/\./g, '-')]"
                >
                  {{ $t(child.name) }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
  </aside>
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue'
import {useNavigationStore} from "@zrm/motor-nx-core/store/navtigation";
import {storeToRefs} from "pinia";
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
import {Skeletor} from "vue-skeletor";
import 'vue-skeletor/dist/vue-skeletor.css'

export default defineComponent({
  name: 'AdminSidebar',
  components: {
    Skeletor
  },
  setup() {
    const runtimeConfig = useRuntimeConfig();
    const showProjectName = computed(() => runtimeConfig.public.showProjectName);
    const navigationStore = useNavigationStore();
    const { activeParent, activeChild , navigationItems, loading} = storeToRefs(navigationStore);
    const { setActiveChild, toggleMenu, getNavigationItems } = navigationStore;
    const routeParser = useRouteParser();
    const route = useRoute();

    // Route parser for different cases (01 März 2023  Martin Henrichs)
    const { routeSlashToDotted, routeRemoveCRUD } = useRouteParser()
    let currentRoute = routeSlashToDotted(route.fullPath);
    currentRoute = routeRemoveCRUD(currentRoute);

    // Wrapper to set navigation parent and child (01 März 2023  Martin Henrichs)
    const setActiveParentChild = (parent: string = '', child: string = '' ) => {
      navigationStore.setActiveParent(parent);
      navigationStore.setActiveChild(child);
    }

    // Set initial navigation active state by route (28 Feb. 2023  Martin Henrichs)
    const initialNaviActionState = () => {
      for (const parents in navigationItems.value) {
        const parent = navigationItems.value[parents];

        // Set parent as child if exist (28 Feb. 2023  Martin Henrichs)
        if (parent.route === currentRoute) {
          setActiveParentChild(parent.slug)
          break;
        }

        // Search Child
        if (parent.route === null) {
          for (const childs in parent.items) {
            const child = parent.items[childs];
            // Set parent and child if exist(28 Feb. 2023  Martin Henrichs)
            if (child.route === currentRoute) {
              setActiveParentChild(parent.slug, child.slug)
              break;
            }
          }
        }
      }
    }

    onMounted(async () => {
      await getNavigationItems();
      initialNaviActionState()
    })

    return {
      navigationItems,
      toggleMenu,
      activeParent,
      activeChild,
      setActiveChild,
      routeParser,
      loading,
      showProjectName
    }
  },
})
</script>
<style lang="scss">
.menu-dropdown {
  cursor: pointer;
}

.sidebar-dropdown {
  max-height: 0;
  overflow-y: hidden;

  &.open {
    max-height: 1500px;
    overflow-y: hidden;
    transition: max-height 0.3s ease-in-out;
  }
}
</style>
