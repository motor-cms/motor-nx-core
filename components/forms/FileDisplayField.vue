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
          isImage(file.mime_type)
            ? 'background-image:url(' +
              (file.url) +
              ');'
            : ''
        "
      >
        <span v-if="!isImage(file.mime_type)" style="overflow-wrap: anywhere">
          {{ file.mime_type }}
        </span>
      </div>
      <div
        class="col-md-8"
        v-if="file.name !== ''"
      >
        <p><strong>File:</strong> {{ file.name }}</p>
        <p>
          <strong>Type:</strong>
          {{ file.mime_type }}
        </p>
        <p>
          <strong>Size:</strong>
          {{ fileSize }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'FileDisplayField',
  props: {
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
  },
  setup(props, ctx) {

    // Check mimetype before displaying an image
    const isImage = (type: string) => {
      const mimeTypes = [
        'image/apng',
        'image/avif',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/webp',
      ]

      return mimeTypes.indexOf(type) > -1
    }

    const fileSize = computed(() => {
      if (props.file.size) {
        return props.file.size + ' kb';
      }
      return '';
    })

    return {
      isImage,
      fileSize
    }
  },
})
</script>
