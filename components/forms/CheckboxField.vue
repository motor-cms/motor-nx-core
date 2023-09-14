<template>
  <div class="form-check" :class="{ 'has-danger': errorMessage }">
    <div class="atom-toggle">
      <span class="atom-toggle__label">{{ label }}</span>
      <label :for="id" class="atom-toggle__switch">
        <input
          type="checkbox"
          :name="name"
          :value="modelValue"
          :checked="modelValue">
        <span class="atom-toggle__slider" @click="emitUpdate" ></span>
      </label>
    </div>
    <p class="text-danger" v-if="errorMessage && meta.touched">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { useField } from 'vee-validate'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CheckboxField',
  props: {
    // Field's own value
    id: String,
    modelValue: {
      type: null,
    },
    emits: ['update:modelValue'],
    label: String,
    name: {
      type: String,
    },
  },
  setup(props, ctx) {
    const { checked, handleChange, errorMessage, meta } = useField(
      <string>props.name,
      undefined,
      {
        type: 'checkbox',
        valueProp: <string>props.modelValue,
      }
    )

    const emitUpdate = () => {
      console.log(props.modelValue);
      ctx.emit('update:modelValue', !props.modelValue);
    }
    // select/unselect the input
    //   handleChange(<string>props.modelValue)

    return {
      checked, // readonly
      //    handleChange,
      errorMessage,
      meta,
      emitUpdate
    }
  },
})
</script>
