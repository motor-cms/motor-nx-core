<template>
  <div class="form-group" :class="{ 'has-danger': errorMessage }">
    <label
      >{{ label }}
      <AdminTooltip
        v-if="description.length"
        :text="description"
        type="info"
        :style="{ 'margin-top': '-8px' }"
      ></AdminTooltip
    ></label>
    <textarea
      :required="required"
      :id="id"
      class="form-control"
      :name="name"
      v-model="value"
      :class="{ 'is-invalid': errorMessage }"
      @blur="handleBlur"
    ></textarea>
    <p class="text-danger" v-if="errorMessage && meta.touched">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { useField } from "vee-validate";

const props = defineProps({
  id: String,
  modelValue: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
});
const { value, errorMessage, handleBlur, handleChange, meta } = useField(
  <string>props.name,
  undefined,
  {
    initialValue: <string>props.modelValue,
    syncVModel: true,
  }
);
</script>
