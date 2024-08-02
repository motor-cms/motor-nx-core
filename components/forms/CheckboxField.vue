<template>
  <div class="form-group" :class="{ 'has-danger': errorMessage }">
    <div class="atom-toggle">
      <span class="atom-toggle__label">{{ label }}</span>
      <AdminTooltip
        v-if="description.length"
        :text="description"
        type="info"
        :style="{ 'margin-top': '-8px' }"
      ></AdminTooltip>
      <label :for="id" class="atom-toggle__switch">
        <input
          type="checkbox"
          :name="name"
          v-model="model"
          :disabled="true"
        />
        <span
          class="atom-toggle__slider"
          :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
          @click="emitUpdate"
        ></span>
      </label>
    </div>
    <p class="text-danger" v-if="errorMessage && meta.touched">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts" setup>
import { useField } from "vee-validate";

import { defineComponent } from "vue";

const props = defineProps({
  // Field's own value
  id: String,
  label: String,
  name: {
    type: String,
  },
  description: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const model = defineModel();
const emit = defineEmits(["update:modelValue"]);
const { checked, handleChange, errorMessage, meta } = useField(
  <string>props.name,
  undefined,
  {
    type: "checkbox",
    checkedValue: <string>props.modelValue,
    syncVModel: true,
  }
);

const emitUpdate = () => {
  if (props.disabled) {
    return;
  }
  emit("update:modelValue", !props.modelValue);
};
// select/unselect the input
//   handleChange(<string>props.modelValue)

</script>
<style>
.atom-toggle__switch {
  margin-left: 1rem;
}

.atom-toggle__label {
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #344767;
  margin-left: 0.25rem;
}
</style>
