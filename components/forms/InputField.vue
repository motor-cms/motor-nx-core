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
      :value="inputValue"
      :class="{ 'is-invalid': errorMessage }"
      @input="changed"
      @blur="blur"
    />
    <p class="text-danger" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useField } from 'vee-validate'

export default defineComponent({
  name: 'InputField',
  props: {
    id: String,
    type: {
      type: String,
      default: 'text',
    },
    value: {
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
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(<string>props.name, undefined, {
      initialValue: <string>props.value,
    })

    watch(inputValue, (newValue) => {
      console.log('prop value changed for field ' + props.name, newValue)
    })

    const changed = (e: Event) => {
      handleChange(e)
      setTimeout(() => {
        emit('change', (<HTMLInputElement>e.target).value)
      }, 100)
    }

    const blur = (e: Event) => {
      handleBlur(e)
      console.log(e)
      setTimeout(() => {
        emit('blur', (<HTMLInputElement>e.target).value)
      }, 100)
    }

    return {
      handleChange,
      handleBlur,
      errorMessage,
      inputValue,
      meta,
      changed,
      blur,
    }
  },
})
</script>
