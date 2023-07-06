<template>
  <AdminContainer>
    <AdminPartialsSpinner v-if="loading"/>
    <NuxtPage/>
  </AdminContainer>
</template>
<script lang="ts" setup>
import {useAppStore} from "@zrm/motor-nx-core/store/app";
import {storeToRefs} from "pinia";

const appStore = useAppStore();
const {loading} = storeToRefs(appStore)
import {useUserStore} from "~/packages/motor-nx-core/store/user";

const userStore = useUserStore();
const token = useCookie('auth_token');

if (!userStore.authenticated && token.value?.length) {
  await userStore.loginFromStorage();
}
</script>
