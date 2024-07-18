<template>
    <AdminContainer>
      <AdminPartialsSpinner v-if="loading"/>
      <div class="builder-main-container">
        <slot/>
      </div>
    </AdminContainer>
</template>
<script lang="ts" setup>

import {storeToRefs} from "pinia";

const appStore = useAppStore();
const userStore = useUserStore();
const {loading} = storeToRefs(appStore)
</script>

<style>
.builder-main-container {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  .main-content {
    //width: 100%;
    margin-top: 50px;
  }

  .form-check-input:checked[type=checkbox] {
    background-image: linear-gradient(310deg, var(--c-primary-100) 0%, var(--c-primary-80) 100%);
  }

  .atom-button {
    pointer-events: none;
  }
}
</style>
