<template>
  <div>
    <AdminSidebar />
    <main class="main-content mt-1 border-radius-lg">
      <!-- Navbar -->
      <AdminHeader />
      <div class="container-fluid py-4">
        <slot></slot>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AdminSidebar from './Sidebar.vue'
import AdminHeader from './Header.vue'

export default defineComponent({
  name: 'AdminContainer',
  components: {
    AdminSidebar,
    AdminHeader,
  },
  setup() {
    document.body.classList.add('g-sidenav-show', 'bg-gray-100')
  },
})
</script>
