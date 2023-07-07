<template>
  <AdminContainer>
    <AdminPartialsSpinner v-if="loading"/>
    <div>
      <NuxtPage/>
    </div>
  </AdminContainer>
</template>
<script lang="ts" setup>
import {useAppStore} from "@zrm/motor-nx-core/store/app";
import {storeToRefs} from "pinia";

const appStore = useAppStore();
const userStore = useUserStore();
const { authenticated } = storeToRefs(userStore);
const {loading} = storeToRefs(appStore)
import {useUserStore} from "~/packages/motor-nx-core/store/user";
</script>
