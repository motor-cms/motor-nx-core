<template>
  <AdminContainer>
    <loading
      :opacity="0.5"
      blur="none"
      v-model:active="spinnerActive"
      :is-full-page="true"
    />
    <router-view />
  </AdminContainer>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AdminContainer from '../components/admin/Container.vue'
import '../assets/js/soft-ui-dashboard.js'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useAppStore } from '../store/app'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'admin-layout',
  components: {
    AdminContainer,
    Loading,
  },
  setup() {
    const appStore = useAppStore()
    const { spinnerActive } = storeToRefs(appStore)
    document.body.classList.add('g-sidenav-show', 'bg-gray-100')

    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyK' && event.metaKey) {
        const element = document.getElementById(
          'motor-grid-search'
        ) as HTMLInputElement

        element.focus()
        element.select()
      }
    })

    return { spinnerActive }
  },
})
</script>
