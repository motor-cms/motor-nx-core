<template>
  <div class="form-group" :class="{ 'has-danger': errorMessage }">
    <label :for="id">
      {{ label }}
    </label>
    <input
      :type="type"
      :id="id"
      class="form-control"
      :name="name"
      v-model="value"
      :class="{ 'is-invalid': errorMessage }"
      @blur="blur"
      :disabled="disableForms"
      @input="changed"
    />
    <p class="text-danger" v-if="errorMessage && meta.touched">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useField } from 'vee-validate'
import {useAppStore} from "@zrm/motor-nx-core/store/app";
import {storeToRefs} from "pinia";

export default defineComponent({
  name: 'InputField',
  props: {
    id: String,
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
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
    cssClass: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const {
      value,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(<string>props.name, undefined, {
      initialValue: <string>props.modelValue,
    })

    const appStore = useAppStore();
    const { loading, updatingInBackground, disableForms} = storeToRefs(appStore);
    const changed = (e: Event) => {
      emit('change', (<HTMLInputElement>e.target).value)
    }

    const blur = (e: Event) => {
      handleBlur(e)
      emit('blur', (<HTMLInputElement>e.target).value)
    }

    return {
      handleChange,
      handleBlur,
      errorMessage,
      meta,
      changed,
      blur,
      loading,
      value,
      updatingInBackground,
      disableForms
    }
  },
})
</script>
