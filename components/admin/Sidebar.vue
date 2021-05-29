<template>
  <aside
    class="
      sidenav
      navbar navbar-vertical navbar-expand-xs
      border-0 border-radius-xl
      my-3
      fixed-left
      ms-3
    "
    id="sidenav-main"
  >
    <div class="sidenav-header">
      <i
        class="
          fas
          fa-times
          p-3
          cursor-pointer
          text-secondary
          opacity-5
          position-absolute
          right-0
          top-0
          d-none d-xl-none
        "
        aria-hidden="true"
        id="iconSidenav"
      ></i>
      <router-link :to="{ name: 'admin.dashboard' }" class="navbar-brand m-0">
        <img
          src="@/assets/img/pm-logo-small.png"
          style="max-width: 40px"
          class="navbar-brand-img"
          alt="Motor NX"
        />
        <span class="ms-1 font-weight-bold">{{ $t('global.project') }}</span>
      </router-link>
    </div>
    <hr class="horizontal dark mt-0" />
    <div class="collapse navbar-collapse w-auto" id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <li class="nav-item" v-for="item in navigationItems" :key="item.name">
          <router-link
            @click="toggleMenu(item.slug)"
            v-if="item.route && router.hasRoute(item.route)"
            class="nav-link"
            :to="{ name: item.route }"
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
              <fa :icon="item.icon"></fa>
            </div>
            <span class="nav-link-text ms-1">{{ $t(item.name) }}</span>
          </router-link>

          <a
            @click="toggleMenu(item.slug)"
            v-if="!item.route"
            class="nav-link menu-dropdown"
            :class="'menu-' + item.slug"
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
              <fa :icon="item.icon"></fa>
            </div>
            <span class="nav-link-text ms-1">{{ $t(item.name) }}</span>
          </a>

          <ul
            v-if="item.items"
            :class="'menu-' + item.slug + '-items'"
            class="navbar-nav sidebar-dropdown"
          >
            <li
              v-for="child in item.items"
              :key="child.slug"
              class="nav-item ps-5"
            >
              <router-link
                v-if="router.hasRoute(child.route)"
                :to="{ name: child.route }"
                class="nav-link"
                :class="'route-' + child.route.replace(/\./g, '-')"
              >
                {{ $t(child.name) }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue'
import useNavigation from 'motor-core/compositions/navigation/useNavigation'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'AdminSidebar',
  setup() {
    const { navigationItems, toggleMenu } = useNavigation()

    const route = useRoute()
    const router = useRouter()

    const checkRoute = (items: any) => {
      let found = ''
      for (const item in items) {
        if (items[item].items) {
          for (const child in items[item].items) {
            let routeName: string = <string>route.name
            // Strip create and edit from route name to still match the active navigation
            routeName = routeName.replace('.create', '').replace('.edit', '')

            if (items[item].items[child].route === routeName) {
              toggleMenu(items[item].slug)

              // Highlight navigation item
              const currentItems = document.getElementsByClassName(
                'route-' + items[item].items[child].route.replace(/\./g, '-')
              )
              if (currentItems.length > 0) {
                currentItems[0].classList.add('active')
              }

              // Highlight parent
              found = items[item].slug
              const elements = document.getElementsByClassName(
                'menu-' + items[item].slug
              )
              if (elements.length > 0) {
                elements[0].classList.add('active')
              }
            }
          }
        }
      }
      // Remove active state from parent items
      const elements = Array.from(
        document.getElementsByClassName('menu-dropdown')
      )
      elements.forEach((element) => {
        if (!element.classList.contains('menu-' + found)) {
          element.classList.remove('active')
        }
      })
    }

    watch(route, () => {
      // FIXME: some weirdness again. unless we do this, the watcher will fire before we actually have entered the route
      // and the navigation highlighting will go kaputt
      setTimeout(() => {
        checkRoute(navigationItems.value)
      }, 0)
    })

    watch(navigationItems, (items) => {
      checkRoute(items)
    })

    // FIXME: why god why is javascript to weird
    setTimeout(() => {
      checkRoute(navigationItems.value)
    }, 50)

    return { navigationItems, toggleMenu, router }
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
