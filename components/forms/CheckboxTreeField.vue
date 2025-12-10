<template>
  <div
    v-if="tree && tree.length"
    class="form-check checkbox-tree"
    :class="{ 'has-danger': errorMessage }"
  >
    <label v-if="label" :for="id" class="d-block">
      {{ label }}
    </label>
    <ul class="checkbox-tree" :class="'level-' + level">
      <li v-for="element in tree" :key="element.id">
        <v-field
          :id="'checkbox_' + element.id"
          type="checkbox"
          class="form-check-input checkbox-tree"
          :name="name"
          :value="element.id"
        />
        {{ element.name }}
        <CheckboxTreeField
          :tree="element.children"
          :name="name"
          :value="modelValue"
          :level="level + 1"
        />
      </li>
    </ul>
    <p v-if="errorMessage && level === 0" class="text-danger">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { useField, Field } from 'vee-validate'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CheckboxTreeField',
  components: {
    VField: Field,
  },
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
    tree: {
      type: Array,
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { checked, handleChange, errorMessage } = useField(
      <string>props.name,
      undefined,
      {
        type: 'checkbox',
        valueProp: <[]>props.modelValue,
        syncVModel: true,
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
<style lang="scss">
input {
  &.checkbox-tree {
    margin-right: 5px;
  }
}
.checkbox-tree {
  ul.level-0 {
    padding-inline-start: 5px;
  }
  ul {
    list-style: none;
    padding-inline-start: 25px;
  }
}
</style>
