<template>
  <div class="form-group">
    <label :for="id">
    </label>
    <div
      class="row"
      style="padding-left: 0.75rem"
      v-if="file"
    >
      <div
        class="col-md-4 drop-zone"
        :style="
          (file && isImage(file.mime_type))
            ? 'background-image:url(' +
              (file.url) +
              ');'
            : ''
        "
      >
        <span v-if="!(isImage(file?.mime_type))" style="overflow-wrap: anywhere">
          {{ convertMimeType(file.mime_type) }}
        </span>
      </div>
      <div
        class="col-md-8"
        v-if="file.name !== ''"
      >
        <p><strong>File:</strong> {{ file?.name }}</p>
        <p>
          <strong>Type:</strong>
          {{ convertMimeType(file.mime_type) }}
        </p>
        <p>
          <strong>Size:</strong>
          {{ fileSize }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useMimeType} from "@zrm/base-components/composables/shared/useMimeType";

const props = defineProps({
  id: String,
  type: {
    type: String,
    default: 'text',
  },
  file: {
    type: Object,
    default: () => {},
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
});

const { convertMimeType, isImage } = useMimeType();

const fileSize = computed(() => {
  if (props.file.size) {
    return props.file.size_human;
  }
  return '';
})

</script>
