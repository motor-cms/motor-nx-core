<template>
  <div class="form-group" :class="{ 'has-danger': errorMessage }">
    <label :for="id">
      {{ label }}
    </label>
    <input
      type="color"
      :id="id"
      class="form-control"
      :name="name"
      :value="inputValue"
      :class="{ 'is-invalid': errorMessage }"
      @input="handleChange"
      @blur="handleBlur"
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
  name: 'ColorField',
  props: {
    id: String,
    type: {
      type: String,
      default: 'text',
    },
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
    cssClass: {
      type: String,
      default: '',
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

    // Convert rgbstring to hex
    const RGBToHex = (rgb: string) => {
      // Choose correct separator
      let sep = rgb.indexOf(',') > -1 ? ',' : ' '
      // Turn "rgb(r,g,b)" into [r,g,b]

      // Check if we're dealing with rgb or rgba
      let splitPosition = 4
      if (rgb.indexOf('rgba') > -1) {
        splitPosition = 5
      }

      const rgbArray = rgb.substr(splitPosition).split(')')[0].split(sep)

      let r = (+rgbArray[0]).toString(16),
        g = (+rgbArray[1]).toString(16),
        b = (+rgbArray[2]).toString(16)

      if (r.length == 1) r = '0' + r
      if (g.length == 1) g = '0' + g
      if (b.length == 1) b = '0' + b

      return '#' + r + g + b
    }

    watch(inputValue, (value: string) => {
      if (value.indexOf('#') == -1) {
        inputValue.value = RGBToHex(value)
      }
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
