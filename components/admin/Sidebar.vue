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
          <li class="nav-item" v-for="topLayerNavItem in navigationItems" :key="topLayerNavItem.name">
            <NuxtLink
              @click="toggleMenu(topLayerNavItem.slug)"
              v-if="topLayerNavItem.route"
              class="nav-link"
              :to="routeParser.routeDottedToSlash(topLayerNavItem.route)"
              :class="{active: activeParent && activeParent ===topLayerNavItem.slug || !activeParent && topLayerNavItem.slug === 'dashboard' }"
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
                <fa :icon="topLayerNavItem.icon"/>
              </div>
              <span class="nav-link-text ms-1">{{ $t(topLayerNavItem.name) }}</span>
            </NuxtLink>
            <a
              @click="toggleMenu(routeParser.routeDottedToSlash(topLayerNavItem.slug, false))"
              v-else
              class="nav-link menu-dropdown"
              :class="[{active: activeParent === routeParser.routeDottedToSlash(topLayerNavItem.slug, false)}, 'menu-' + topLayerNavItem.slug]"
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
                <fa :icon="topLayerNavItem.icon" />
              </div>
              <span class="nav-link-text ms-1">{{ $t(topLayerNavItem.name) }}</span>
            </a>
            <ul
              v-if="topLayerNavItem.items"
              :class="[{open: activeParent === topLayerNavItem.slug}, 'menu-' + topLayerNavItem.slug + '-items']"
              class="navbar-nav sidebar-dropdown"
            >
              <li
                v-for="childNavItem in topLayerNavItem.items"
                :key="childNavItem.slug"
                class="nav-item ps-5"
                @click="setActiveChild(childNavItem.slug)"
              >
                <NuxtLink
                  :to="routeParser.routeDottedToSlash(childNavItem.route ? childNavItem.route : '')"
                  class="nav-link"
                  :class="[{active: activeChild === childNavItem.slug}, 'route-' + childNavItem.route?.replace(/\./g, '-')]"
                >
                  {{ $t(childNavItem.name) }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
  </aside>
</template>
<script setup lang="ts">
import {useNavigationStore} from "@zrm/motor-nx-core/store/navtigation";
import {storeToRefs} from "pinia";
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
import {Skeletor} from "vue-skeletor";
import 'vue-skeletor/dist/vue-skeletor.css'
import NavigationItem from "packages/motor-nx-core/types/navigation-item";

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
  for (const topLayerNavigationRecord in navigationItems.value) {
    const topLayerNavigationItem: NavigationItem = navigationItems.value[topLayerNavigationRecord];

    //Case: The top most navigation items do have a route => they can be selected & will be marked as selected
    if (topLayerNavigationItem.route === currentRoute) {
      setActiveParentChild(topLayerNavigationItem.slug)
      break;
    }

    //Case: The top most navigation items don't have a route => can't be selected => child needs to be selected
    if (topLayerNavigationItem.route === null) {
      for (const childRecord in topLayerNavigationItem.items) {
        const childNavigationItem = topLayerNavigationItem.items[childRecord];
        // Set parent and child if exist(28 Feb. 2023  Martin Henrichs)
        if (childNavigationItem.route === currentRoute) {
          setActiveParentChild(topLayerNavigationItem.slug, childNavigationItem.slug)
          break;
        }
      }
    }
  }
}

await getNavigationItems();
initialNaviActionState()

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
