<template>
  <div class="form-check" :class="{ 'has-danger': errorMessage }">
    <label :for="id" class="d-block">
      {{ label }}
    </label>
    <div class="row" style="padding-left: 0.75rem">
      <div class="col-4" v-for="(option, index) in options" :key="index">
        <label :for="'checkbox_' + option.value">{{ option.name }}</label>
        <v-field
          :id="'checkbox_' + option.value"
          type="checkbox"
          class="form-check-input"
          :class="({ 'is-invalid': errorMessage }, id)"
          :name="name"
          :value="option.value"
        />
      </div>
    </div>
    <p class="text-danger" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { useField, Field } from 'vee-validate'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CheckboxArrayField',
  props: {
    // Field's own value
    id: String,
    value: {
      type: Array,
    },
    label: String,
    name: {
      type: String,
    },
    options: {
      type: Array,
    },
  },
  components: {
    VField: Field,
  },
  setup(props) {
    const { checked, handleChange, errorMessage } = useField(
      <string>props.name,
      undefined,
      {
        type: 'checkbox',
        valueProp: <[]>props.value,
      }
    )

    return {
      checked, // readonly
      handleChange,
      errorMessage,
    }
  },
})
</script>
