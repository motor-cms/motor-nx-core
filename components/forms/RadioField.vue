<template>
  <label :for="id" class="d-block">
    {{ label }}
  </label>
  <div class="form-check" :class="{ 'has-danger': errorMessage }">
    <div class="row" style="padding-left: 0.75rem">
      <div v-for="(option, index) in options" :key="index" class="col-4">
        <label :for="'radio_' + option.value">{{ option.label }}</label>
        <v-field
          :id="'radio_' + option.value"
          type="radio"
          class="form-check-input"
          :class="({ 'is-invalid': errorMessage }, id)"
          :name="name"
          :value="option.value"
        />
      </div>
    </div>
    <p v-if="errorMessage" class="text-danger">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { useField, Field } from 'vee-validate'

const model = defineModel();
const props = defineProps({
  // Field's own value
  id: String,
  label: String,
  name: {
    type: String,
  },
  options: {
    type: Array,
  },
});
const { checked, handleChange, errorMessage } = useField(
  <string>props.name,
  undefined,
  {
    type: 'checkbox',
    valueProp: model.value,
    initialValue: model.value,
    syncVModel: true,
  }
)
</script>
