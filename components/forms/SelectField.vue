<template>
  <div class="form-group" :class="{ 'has-danger': errorMessage }">
    <label :for="id">
      {{ label }}
    </label>
    <select
      :id="id"
      :name="name"
      v-model="value"
      :class="{ 'is-invalid': errorMessage }"
      :disabled="disableForms"
      @blur="handleBlur"
      class="form-control"
    >
      <option
        v-for="(option, index) in options"
        :key="option.value"
        :value="option.value"
        :selected="index === 0"
      >
        {{ option.name }}
      </option>
    </select>
    <p class="text-danger" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { useField } from 'vee-validate'
import { defineComponent } from 'vue'
import {useAppStore} from "@zrm/motor-nx-core/store/app";
import {storeToRefs} from "pinia";

export default defineComponent({
  name: 'SelectField',

  props: {
    id: String,
    modelValue: {
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
    options: Array,
  },
  setup(props) {
    const appStore = useAppStore();
    const { loading, updatingInBackground, disableForms } = storeToRefs(appStore);
    const {
      value,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(<string>props.name, undefined, {
      initialValue: <string>props.modelValue,
    })

    return {
      handleChange,
      handleBlur,
      errorMessage,
      value,
      meta,
      loading,
      updatingInBackground,
      disableForms
    }
  },
})
</script>
