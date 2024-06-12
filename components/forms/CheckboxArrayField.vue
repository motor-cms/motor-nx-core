<template>
  <label :for="id" class="d-block">
    {{ label }}
  </label>
  <div class="form-check" :class="{ 'has-danger': errorMessage }">
    <div class="row" style="padding-left: 0.75rem">
      <div class="col-4" v-for="option in options" :key="JSON.stringify(option)">
        <label :for="'checkbox_' + option.value">{{ option.label }}</label>
        <v-field
          :id="'checkbox_' + option.value"
          type="checkbox"
          class="form-check-input"
          :class="{ 'is-invalid': errorMessage }"
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
import { useField, Field } from "vee-validate";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CheckboxArrayField",
  props: {
    // Field's own value
    id: String,
    modelValue: {
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
        type: "checkbox",
        valueProp: props.modelValue,
        initialValue: props.modelValue,
        syncVModel: true,
      }
    );

    return {
      checked, // readonly
      handleChange,
      errorMessage,
    };
  },
});
</script>
