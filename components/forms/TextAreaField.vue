<template>
  <div class="form-group" :class="{ 'has-danger': errorMessage }">
    <label :for="id">
      {{ label }}
    </label>
    <textarea
      :id="id"
      class="form-control"
      :name="name"
      :value="inputValue"
      :class="{ 'is-invalid': errorMessage }"
      @input="handleChange"
      @blur="handleBlur"
    ></textarea>
    <p class="text-danger" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { useField } from 'vee-validate'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TextAreaField',

  props: {
    id: String,
    value: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(<string>props.name, undefined, {
      initialValue: <string>props.value,
    })
    return {
      handleChange,
      handleBlur,
      errorMessage,
      inputValue,
      meta,
    }
  },
})
</script>
