<template>
  <div class="inline mb-0 ms-1">
    <button
      class="btn btn-primary btn-sm me-2"
      type="button"
      :title="options?.name"
      @click="functionToCall()"
      href="javascript:;"
    >
      {{ options?.name }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";

const props = defineProps({
  options: Object,
  record: Object,
});

const { $toast } = useNuxtApp();
const { t } = useI18n();

const functionToCall = async () => {
  if (props.options && props.options.onClick) {
    props.options.onClick(props.record);
  } else {
    $toast.error(t("motor-nx-core::backend.no_on_click_defined"));
    console.error("No onClick function defined for ActionButton");
  }
};
</script>
