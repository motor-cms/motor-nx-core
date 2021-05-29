<template>
  <div
    class="form-check checkbox-tree"
    :class="{ 'has-danger': errorMessage }"
    v-if="tree && tree.length"
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
          :value="value"
          :level="level + 1"
        />
      </li>
    </ul>
    <p class="text-danger" v-if="errorMessage && level === 0">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script lang="ts">
import { useField, Field } from 'vee-validate'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CheckboxTreeField',
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
    tree: {
      type: Array,
    },
    level: {
      type: Number,
      default: 0,
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
