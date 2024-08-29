<template>
  <div class="motor-nx-core">
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
<script setup lang="ts">
import AdminHeader from './Header.vue'
</script>
<style scoped lang="scss">
.main-content {
  width: calc(100% - 550px);
}
</style>
