<template>
  <div class="form-group" :class="{ 'has-danger': errorMessage }">
    <label
      >{{ label }}
      <AdminTooltip
        v-if="description.length"
        :text="description"
        type="info"
        :style="{ 'margin-top': '-8px' }"
      ></AdminTooltip
    ></label>
    <textarea
      ref="textareaRef"
      :required="required"
      :id="id"
      class="form-control"
      :name="name"
      v-model="value"
      :rows="rows"
      :class="{ 'is-invalid': errorMessage }"
      :style="textareaStyle"
      @blur="handleBlur"
      @input="adjustHeight"
    ></textarea>
    <p class="text-danger" v-if="errorMessage && meta.touched">
      {{ errorMessage }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { useField } from "vee-validate";
import { ref, computed, onMounted, watch, nextTick } from "vue";

const props = defineProps({
  id: String,
  modelValue: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 3,
  },
  minRows: {
    type: Number,
    default: 3,
  },
  maxRows: {
    type: Number,
    default: 15,
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
});

const { value, errorMessage, handleBlur, handleChange, meta } = useField(
  <string>props.name,
  undefined,
  {
    initialValue: <string>props.modelValue,
    syncVModel: true,
  }
);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Calculate min and max height based on line-height
const textareaStyle = computed(() => {
  if (!props.autoResize) {
    return {};
  }
  
  // Approximate line height in pixels (can be adjusted based on your CSS)
  const lineHeight = 24;
  const minHeight = props.minRows * lineHeight;
  const maxHeight = props.maxRows * lineHeight;
  
  return {
    minHeight: `${minHeight}px`,
    maxHeight: `${maxHeight}px`,
    overflow: 'auto',
    resize: 'vertical',
  };
});

const adjustHeight = () => {
  if (!props.autoResize || !textareaRef.value) {
    return;
  }

  const textarea = textareaRef.value;
  const lineHeight = 24;
  const minHeight = props.minRows * lineHeight;
  const maxHeight = props.maxRows * lineHeight;

  // Reset height to auto to get the correct scrollHeight
  textarea.style.height = 'auto';
  
  // Calculate new height based on content
  let newHeight = textarea.scrollHeight;
  
  // Apply min and max constraints
  if (newHeight < minHeight) {
    newHeight = minHeight;
  } else if (newHeight > maxHeight) {
    newHeight = maxHeight;
  }
  
  textarea.style.height = `${newHeight}px`;
};

// Adjust height on mount and when value changes
onMounted(() => {
  nextTick(() => {
    adjustHeight();
  });
});

watch(value, () => {
  nextTick(() => {
    adjustHeight();
  });
});
</script>
