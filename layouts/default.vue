<template>
  <template v-if="authenticated">
  <AdminContainer>
    <AdminPartialsSpinner v-if="loading"/>
    <div class="builder-main-container">
      <slot/>
    </div>
  </AdminContainer>
  </template>
  <template v-else>
    <Login/>
  </template>
</template>
<script lang="ts" setup>

import {storeToRefs} from "pinia";

const appStore = useAppStore();
const userStore = useUserStore();
const { authenticated } = storeToRefs(userStore);
const {loading} = storeToRefs(appStore)

import Login from "@zrm/motor-nx-core/pages/admin/Login.vue";
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
}
</style>
