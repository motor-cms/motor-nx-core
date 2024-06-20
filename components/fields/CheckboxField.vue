<template>
  <div class="form-group">
    <div class="atom-toggle">
      <span class="atom-toggle__label">{{ label }}</span>
      <AdminTooltip v-if="description.length" :text="description" type="info" :style="{'margin-top': '-8px'}"></AdminTooltip>
      <label :for="id" class="atom-toggle__switch">
        <input
          type="checkbox"
          :name="name"
          v-model="model"
          @input="emitUpdate">
      </label>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  id: String,
  label: String,
  name: {
    type: String,
  },
  description: {
    type: String,
    default: '',
  }
});
const model = defineModel();
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
