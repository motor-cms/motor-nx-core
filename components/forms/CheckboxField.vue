<template>
  <div class="form-check" :class="{ 'has-danger': errorMessage }">
    <label :for="id" class="d-block">
      {{ label }}
    </label>
    <input
      :id="id"
      type="checkbox"
      class="form-check-input"
      :class="{ 'is-invalid': errorMessage }"
      :name="name"
      :value="name"
      :checked="value"
      @input="handleChange(!value)"
    />
    <p class="text-danger" v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { useField } from 'vee-validate'

// CAVEAT: i don't really know WHY this is now working but apparently switching @input="handleChange(value)" to !value seemed to do the trick
// Better never touch this again!
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CheckboxField',
  props: {
    // Field's own value
    id: String,
    value: {
      type: null,
    },
    label: String,
    name: {
      type: String,
    },
  },
  setup(props) {
    const { checked, handleChange, errorMessage } = useField(
      <string>props.name,
      undefined,
      {
        type: 'checkbox',
        valueProp: <string>props.value,
      }
    )

    // select/unselect the input
    handleChange(<string>props.value)

    return {
      checked, // readonly
      handleChange,
      errorMessage,
    }
  },
})
</script>
