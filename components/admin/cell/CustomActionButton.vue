<template>
  <div class="inline mb-0 ms-1">
    <a @click="functionToCall()" class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
      <fa :icon="options.icon ?? 'eye'"></fa>
    </a>
  </div>
</template>
<script setup lang="ts">
import {v4} from "uuid";
import useApi from "@zrm/motor-nx-core/composables/http/api";
import {useI18n} from "vue-i18n";

const props = defineProps({
  options: Object,
  record: Object,
  resource: String,
})

const config = useRuntimeConfig();
const appStore = useAppStore();
const { $toast } = useNuxtApp();
const {t} = useI18n()
const api = useApi();

const functionToCall = async () => {
  if(props.options && props.options.onClick) {
    props.options.onClick(props);
  } else {
    $toast.error(t('motor-nx-core::backend.no_on_click_defined'));
    console.error("No onClick function defined for CustomActionButton")
  }
}
</script>
