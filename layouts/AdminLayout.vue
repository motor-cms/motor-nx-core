<template>
  <AdminContainer>
    <AdminPartialsSpinner v-if="loading" />
    <NuxtPage />
  </AdminContainer>
</template>
<script lang="ts" setup>
import {useAppStore} from "@zrm/motor-nx-core/store/app";
import {storeToRefs} from "pinia";
const appStore = useAppStore();
const { loading } = storeToRefs(appStore)

const active = true;
</script>
